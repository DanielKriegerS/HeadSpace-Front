import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  Observable,
  switchMap
} from 'rxjs';

import {
  CsrfService
} from '../../../core/http/csrf.service';

import {
  AdminUserDetails,
  AdminUserFilters,
  AdminUserPage
} from './administration-user.models';

const ADMIN_USERS_ENDPOINT =
  '/api/v1/admin/users';

const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 100;

@Injectable({
  providedIn: 'root'
})
export class AdministrationUserService {
  private readonly http = inject(HttpClient);
  private readonly csrfService = inject(CsrfService);

  listUsers(
    filters: AdminUserFilters
  ): Observable<AdminUserPage> {
    return this.http.get<AdminUserPage>(
      ADMIN_USERS_ENDPOINT,
      {
        params: this.createListParams(filters)
      }
    );
  }

  getUserById(
    userId: string
  ): Observable<AdminUserDetails> {
    return this.http.get<AdminUserDetails>(
      this.createUserEndpoint(userId)
    );
  }

  banUser(
    userId: string
  ): Observable<void> {
    return this.executeStatusCommand(
      userId,
      'ban'
    );
  }

  unbanUser(
    userId: string
  ): Observable<void> {
    return this.executeStatusCommand(
      userId,
      'unban'
    );
  }

  private executeStatusCommand(
    userId: string,
    command: 'ban' | 'unban'
  ): Observable<void> {
    const endpoint =
      `${this.createUserEndpoint(userId)}/${command}`;

    return this.csrfService.getHeaders().pipe(
      switchMap((headers) =>
        this.http.post<void>(
          endpoint,
          null,
          {
            headers
          }
        )
      )
    );
  }

  private createListParams(
    filters: AdminUserFilters
  ): HttpParams {
    const page = Math.max(0, filters.page);

    const size = Math.min(
      MAX_PAGE_SIZE,
      Math.max(MIN_PAGE_SIZE, filters.size)
    );

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', filters.sortBy)
      .set('direction', filters.direction);

    const normalizedSearch =
      filters.search?.trim();

    if (normalizedSearch) {
      params = params.set(
        'search',
        normalizedSearch
      );
    }

    if (filters.status) {
      params = params.set(
        'status',
        filters.status
      );
    }

    if (filters.role) {
      params = params.set(
        'role',
        filters.role
      );
    }

    return params;
  }

  private createUserEndpoint(
    userId: string
  ): string {
    return `${ADMIN_USERS_ENDPOINT}/${encodeURIComponent(userId)}`;
  }
}