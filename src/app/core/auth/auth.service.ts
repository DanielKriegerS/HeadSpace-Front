import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';

import {
  BACKEND_ORIGIN
} from '../http/backend.origin.token';

import {
  CsrfService
} from '../http/csrf.service';

import {
  CurrentUser
} from '../models/CurrentUser';

import {
  AuthStore
} from './auth.store';

const AUTH_ENDPOINTS = {
  currentUser: '/api/v1/me',
  logout: '/api/v1/auth/logout',
  googleLogin: '/oauth2/authorization/google'
} as const;

const AUTH_MESSAGES = {
  accessUnavailable:
    'Este acesso não está disponível para o usuário atual.',

  sessionVerificationFailed:
    'Não foi possível verificar sua sessão. Tente novamente.',

  csrfLogoutFailed:
    'Não foi possível encerrar a sessão porque a validação de segurança falhou.',

  logoutFailed:
    'Não foi possível encerrar a sessão. Tente novamente.'
} as const;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);
  private readonly csrfService = inject(CsrfService);
  private readonly backendOrigin = inject(BACKEND_ORIGIN);

  loadCurrentUser(): Observable<void> {
    this.store.setInitializing();

    return this.fetchCurrentUser().pipe(
      tap((currentUser) => {
        this.store.setAuthenticated(currentUser);
      }),
      map(() => undefined),
      catchError((error: HttpErrorResponse) =>
        this.handleCurrentUserError(error)
      )
    );
  }

  loginWithGoogle(): void {
    window.location.assign(
      `${this.backendOrigin}${AUTH_ENDPOINTS.googleLogin}`
    );
  }

  logout(): Observable<void> {
    if (this.store.logoutInProgress()) {
      return of(undefined);
    }

    this.prepareLogout();

    return this.csrfService.getHeaders().pipe(
      switchMap((headers) =>
        this.requestLogout(headers)
      ),
      tap(() => {
        this.completeLogout();
      }),
      catchError((error: HttpErrorResponse) =>
        this.handleLogoutError(error)
      ),
      finalize(() => {
        this.store.setLogoutInProgress(false);
      })
    );
  }

  clearState(): void {
    this.store.clear();
  }

  private fetchCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(
      AUTH_ENDPOINTS.currentUser
    );
  }

  private requestLogout(
    headers: HttpHeaders
  ): Observable<void> {
    return this.http.post<void>(
      AUTH_ENDPOINTS.logout,
      null,
      {
        headers
      }
    );
  }

  private handleCurrentUserError(
    error: HttpErrorResponse
  ): Observable<void> {
    if (error.status === 401) {
      this.store.setAnonymous();

      return of(undefined);
    }

    if (error.status === 403) {
      this.store.setError(
        AUTH_MESSAGES.accessUnavailable
      );

      return of(undefined);
    }

    this.store.setError(
      AUTH_MESSAGES.sessionVerificationFailed
    );

    return of(undefined);
  }

  private handleLogoutError(
    error: HttpErrorResponse
  ): Observable<void> {
    if (error.status === 401) {
      this.completeLogout();

      return of(undefined);
    }

    if (error.status === 403) {
      this.store.setOperationError(
        AUTH_MESSAGES.csrfLogoutFailed
      );

      return of(undefined);
    }

    this.store.setOperationError(
      AUTH_MESSAGES.logoutFailed
    );

    return of(undefined);
  }

  private prepareLogout(): void {
    this.store.clearOperationError();
    this.store.setLogoutInProgress(true);
  }

  private completeLogout(): void {
    this.store.clear();

    void this.router.navigate(['/home']);
  }
}