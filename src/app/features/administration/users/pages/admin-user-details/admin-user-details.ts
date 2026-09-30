import {
  DatePipe
} from '@angular/common';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  finalize,
  of,
  map,
  switchMap,
  tap
} from 'rxjs';

import {
  AuthService
} from '../../../../../core/auth/auth.service';

import {
  AuthStore
} from '../../../../../core/auth/auth.store';

import {
  getProblemDetail
} from '../../../../../core/http/problem-details.util';

import {
  RoleName
} from '../../../../../core/models/RoleName';

import {
  AdminUserStatusBadge
} from '../../components/admin-user-status-badge/admin-user-status-badge';

import {
  AdminUserDetails as AdminUserDetailsModel
} from '../../administration-user.models';

import {
  AdministrationUserService
} from '../../administration-user.service';

import {
  AdminUserAction,
  AdminUserActionDialog
} from '../../components/admin-user-action-dialog/admin-user-action-dialog';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
    imports: [
    DatePipe,
    RouterLink,
    AdminUserStatusBadge,
    AdminUserActionDialog
  ],
  templateUrl: './admin-user-details.html',
  styleUrl: './admin-user-details.scss'
})
export class AdminUserDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service =
    inject(AdministrationUserService);

  private readonly authSStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = signal<AdminUserDetailsModel | null>(
    null
  );

  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);
  readonly correlationId = signal<string | null>(null);
  readonly imageFailed = signal(false);
  readonly isCurrentUser = computed(() => {
    const user = this.user();
    const currentUser = this.authSStore.currentUser();

    return Boolean(
      user &&
      currentUser &&
      user.id === currentUser.id
    );
  });

  readonly selectedAction =
  signal<AdminUserAction | null>(null);

  readonly actionInProgress = signal(false);

  readonly actionError = signal<string | null>(null);

  readonly successMessage = signal<string | null>(null);

  readonly canManageStatus = computed(() =>
    Boolean(
      this.user() &&
      !this.isCurrentUser() &&
      !this.isAdministrator()
    )
  );

  readonly isAdministrator = computed(() =>
    this.user()?.roles.includes('ROLE_ADMIN') ?? false
  );

  readonly protectedAccountMessage = computed(() => {
    if (this.isCurrentUser()) {
      return 'Não é possível banir a própria conta.';
    }

    if (this.isAdministrator()) {
      return 'Contas administrativas são protegidas e não podem ser banidas por esta interface.';
    }

    return null;
  });

  constructor() {
    this.observeUserId();
  }

  retry(): void {
    const userId =
      this.route.snapshot.paramMap.get('userId');

    if (!userId) {
      this.notFound.set(true);
      return;
    }

    this.loadUser(userId);
  }

  markImageAsFailed(): void {
    this.imageFailed.set(true);
  }

  shouldShowImage(): boolean {
    const user = this.user();
    return Boolean(
      user?.profileImageUrl &&
      !this.imageFailed()
    );
  }

  getInitial(username: string): string {
    return username
      .trim()
      .charAt(0)
      .toUpperCase();
  }

  translateRole(role: RoleName): string {
    const translations: Record<RoleName, string> = {
      ROLE_USER: 'Leitor',
      ROLE_AUTHOR: 'Autor',
      ROLE_ADMIN: 'Administrador'
    };

    return translations[role];
  }

  private observeUserId(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('userId')),
        filter(
          (userId): userId is string =>
            Boolean(userId)
        ),
        distinctUntilChanged(),
        tap(() => {
          this.resetViewState();
        }),
        switchMap((userId) =>
          this.fetchUser(userId)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        this.user.set(user);
        });
  }
  private fetchUser(
    userId: string
  ) {
    return this.service.getUserById(userId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleLoadError(error);

          return EMPTY;
        }),
       finalize(() => {
          this.loading.set(false);
        })
      );
  }

  private loadUser(userId: string): void {
    this.resetViewState();

    this.fetchUser(userId)
    .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
    .subscribe((user) => {
        this.user.set(user);
      });
  }

  private resetViewState(): void {
    this.user.set(null);
    this.loading.set(true);
    this.notFound.set(false);
    this.error.set(null);
    this.correlationId.set(null);
    this.imageFailed.set(false);

    this.selectedAction.set(null);
    this.actionInProgress.set(false);
    this.actionError.set(null);
    this.successMessage.set(null);
  }

  openActionDialog(action: AdminUserAction): void {
    if (
      !this.canManageStatus() ||
      this.actionInProgress()
    ) {
      return;
    }

    const user = this.user();

    if (!user) {
      return;
    }

    const actionMatchesStatus =
      action === 'BAN'
        ? user.status === 'ACTIVE'
        : user.status === 'BANNED';

    if (!actionMatchesStatus) {
      return;
    }

    this.actionError.set(null);
    this.successMessage.set(null);
    this.selectedAction.set(action);
  }

  closeActionDialog(): void {
    if (this.actionInProgress()) {
      return;
    }

    this.selectedAction.set(null);
    this.actionError.set(null);
  }

  confirmSelectedAction(): void {
    const user = this.user();
    const action = this.selectedAction();

    if (
      !user ||
      !action ||
      !this.canManageStatus() ||
      this.actionInProgress()
    ) {
      return;
    }

    this.actionInProgress.set(true);
    this.actionError.set(null);
    this.successMessage.set(null);

    const request =
      action === 'BAN'
        ? this.service.banUser(user.id)
        : this.service.unbanUser(user.id);

    request
      .pipe(
        switchMap(() =>
          this.service.getUserById(user.id)
        ),
        finalize(() => {
          this.actionInProgress.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (updatedUser) => {
          this.user.set(updatedUser);
          this.selectedAction.set(null);

          this.successMessage.set(
            action === 'BAN'
              ? 'Usuário banido com sucesso.'
              : 'Usuário desbanido com sucesso.'
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleActionError(error);
        }
      });
  }

  private handleLoadError(
    error: HttpErrorResponse
  ): void {
    const problem = getProblemDetail(error.error);

    this.correlationId.set(
      problem?.correlationId ?? null
    );

    switch (problem?.code) {
      case 'USER_NT_FOUND':
        this.notFound.set(true);
        return;

      case 'ACCESS_DENIED':
      case 'ADMIN_NOT_ALLOWED':
        void this.router.navigate([
          '/acesso-negado'
        ]);
        return;

      case 'AUTHENTICATION_REQUI*ED':
      case 'USER_BANNED':
        this.authService.clearState();
        void this.router.navigate([
          '/home'
        ]);

        return;

      default:
        this.error.set(
          'Não foi possível carregar os detalhes do usuário. Tente novamente.'
        );
    }
  }

  private handleActionError(
    error: HttpErrorResponse
  ): void {
    const problem = getProblemDetail(error.error);

    this.correlationId.set(
      problem?.correlationId ?? null
    );

    switch (problem?.code) {
      case 'ADMIN_SELF_BAN_NOT_ALLOWED':
        this.actionError.set(
          'Não é possível banir a própria conta.'
        );
        return;

      case 'ADMIN_BAN_NOT_ALLOWED':
        this.actionError.set(
          'Não é possível banir outra conta administrativa.'
        );
        return;

      case 'ADMIN_NOT_ALLOWED':
      case 'ACCESS_DENIED':
        this.selectedAction.set(null);

        void this.router.navigate([
          '/acesso-negado'
        ]);

        return;

      case 'USER_NOT_FOUND':
        this.selectedAction.set(null);
        this.notFound.set(true);
        this.user.set(null);
        return;

      case 'AUTHENTICATION_REQUIRED':
        this.selectedAction.set(null);
        this.authService.clearState();

        void this.router.navigate([
          '/home'
        ]);

        return;

      case 'USER_BANNED':
        this.selectedAction.set(null);
        this.authService.clearState();

        void this.router.navigate([
          '/home'
        ]);

        return;

      default:
        this.actionError.set(
          'Não foi possível concluir a operação. Tente novamente.'
        );
    }
  }
}