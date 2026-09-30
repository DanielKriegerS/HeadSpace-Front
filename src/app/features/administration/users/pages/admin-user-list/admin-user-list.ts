import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  finalize
} from 'rxjs';

import {
  RoleName
} from '../../../../../core/models/RoleName';

import {
  UserStatus
} from '../../../../../core/models/UserStatus';

import {
  getProblemDetail
} from '../../../../../core/http/problem-details.util';

import {
  AuthService
} from '../../../../../core/auth/auth.service';

import {
  AdminUserFilterSelection,
  AdminUserFiltersComponent
} from '../../components/admin-user-filters/admin-user-filters';

import {
  AdminUserSortSelection,
  AdminUserTable
} from '../../components/admin-user-table/admin-user-table';

import {
  AdministrationUserService
} from '../../administration-user.service';

import {
  AdminUserFilters,
  AdminUserPage,
  AdminUserSortField,
  SortDirection
} from '../../administration-user.models';

const DEFAULT_FILTERS: AdminUserFilters = {
  page: 0,
  size: 20,
  sortBy: 'createdAt',
  direction: 'DESC'
};

const VALID_PAGE_SIZES = [
  10,
  20,
  50
] as const;

const VALID_SORT_FIELDS: AdminUserSortField[] = [
  'createdAt',
  'username',
  'email',
  'status'
];

const VALID_DIRECTIONS: SortDirection[] = [
  'ASC',
  'DESC'
];

const VALID_STATUSES: UserStatus[] = [
  'ACTIVE',
  'BANNED'
];

const VALID_ROLES: RoleName[] = [
  'ROLE_USER',
  'ROLE_AUTHOR',
  'ROLE_ADMIN'
];

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [
    AdminUserFiltersComponent,
    AdminUserTable
  ],
  templateUrl: './admin-user-list.html',
  styleUrl: './admin-user-list.scss'
})
export class AdminUserList {
  private readonly service =
    inject(AdministrationUserService);

  private readonly authService = 
    inject(AuthService);

  private readonly route = 
    inject(ActivatedRoute);

  private readonly router = 
    inject(Router);
  private readonly destroyRef = 
    inject(DestroyRef);

  readonly filters = signal<AdminUserFilters>(
    DEFAULT_FILTERS
  );

  readonly page = signal<AdminUserPage | null>(null);
  readonly loading = signal(false);
  readonly initialized = signal(false);
  readonly error = signal<string | null>(null);
  readonly correlationId = signal<string | null>(null);

  constructor() {
    this.observeRouteFilters();
  }

  onFiltersChanged(
    selection: AdminUserFilterSelection
  ): void {
    this.updateQueryParams({
      search: selection.search ?? null,
      status: selection.status ?? null,
      role: selection.role ?? null,
      size: selection.size,
      page: 0
    });
  }

  onSortChanged(
    selection: AdminUserSortSelection
  ): void {
    this.updateQueryParams({
      sortBy: selection.sortBy,
      direction: selection.direction,
      page: 0
    });
  }

  goToPreviousPage(): void {
    const currentPage = this.page();

    if (!currentPage || currentPage.first) {
      return;
    }

    this.updateQueryParams({
      page: currentPage.page - 1
    });
  }

  goToNextPage(): void {
    const currentPage = this.page();

    if (!currentPage || currentPage.last) {
      return;
    }

    this.updateQueryParams({
      page: currentPage.page + 1
    });
  }

  retry(): void {
    this.loadUsers(this.filters());
  }

  private observeRouteFilters(): void {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((queryParams) => {
        const filters = this.parseFilters({
          search: queryParams.get('search'),
          status: queryParams.get('status'),
          role: queryParams.get('role'),
          page: queryParams.get('page'),
          size: queryParams.get('size'),
          sortBy: queryParams.get('sortBy'),
          direction: queryParams.get('direction')
        });

        this.filters.set(filters);
        this.loadUsers(filters);
      });
  }

  private loadUsers(
    filters: AdminUserFilters
  ): void {
    this.loading.set(true);
    this.error.set(null);
    this.correlationId.set(null);

    this.service
      .listUsers(filters)
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.initialized.set(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (page) => {
          this.page.set(page);
        },
        error: (error: HttpErrorResponse) => {
          this.handleLoadError(error);
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
      case 'INVALID_PARAMETER':
        this.error.set(
          'Um ou mais filtros são inválidos. Limpe os filtros e tente novamente.'
        );
        return;

      case 'ACCESS_DENIED':
      case 'ADMIN_NOT_ALLOWED':
        void this.router.navigate([
          '/acesso-negado'
        ]);
        return;

      case 'AUTHENTICATION_REQUIRED':
      case 'USER_BANNED':
        this.authService.clearState();

        void this.router.navigate([
          '/home'
        ]);

        return;

      default:
        this.error.set(
          'Não foi possível carregar os usuários. Tente novamente.'
        );
    }
  }

  private updateQueryParams(
    params: Params
  ): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private parseFilters(
    values: Record<string, string | null>
  ): AdminUserFilters {
    return {
      search: this.parseSearch(values['search']),
      status: this.parseStatus(values['status']),
      role: this.parseRole(values['role']),
      page: this.parsePage(values['page']),
      size: this.parseSize(values['size']),
      sortBy: this.parseSortField(
        values['sortBy']
      ),
      direction: this.parseDirection(
        values['direction']
      )
    };
  }

  private parseSearch(
    value: string | null
  ): string | undefined {
    const normalized = value?.trim();

    return normalized || undefined;
  }

  private parseStatus(
    value: string | null
  ): UserStatus | undefined {
    return VALID_STATUSES.includes(
      value as UserStatus
    )
      ? value as UserStatus
      : undefined;
  }

  private parseRole(
    value: string | null
  ): RoleName | undefined {
    return VALID_ROLES.includes(
      value as RoleName
    )
      ? value as RoleName
      : undefined;
  }

  private parsePage(
    value: string | null
  ): number {
    const parsedValue = Number(value);

    return Number.isInteger(parsedValue) &&
      parsedValue >= 0
      ? parsedValue
      : DEFAULT_FILTERS.page;
  }

  private parseSize(
    value: string | null
  ): number {
    const parsedValue = Number(value);

    return VALID_PAGE_SIZES.includes(
      parsedValue as typeof VALID_PAGE_SIZES[number]
    )
      ? parsedValue
      : DEFAULT_FILTERS.size;
  }

  private parseSortField(
    value: string | null
  ): AdminUserSortField {
    return VALID_SORT_FIELDS.includes(
      value as AdminUserSortField
    )
      ? (value as AdminUserSortField)
      : DEFAULT_FILTERS.sortBy;
  }

  private parseDirection(
    value: string | null
  ): SortDirection {
    return VALID_DIRECTIONS.includes(
      value as SortDirection
    )
      ? (value as SortDirection)
      : DEFAULT_FILTERS.direction;
  }
}