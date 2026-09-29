import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  inject,
  Injectable
} from '@angular/core';

import {
  map,
  Observable
} from 'rxjs';

import { CsrfTokenResponse } from '../models/csrf-token-response.model';

const CSRF_ENDPOINT = '/api/v1/auth/csrf';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private readonly http = inject(HttpClient);

  getToken(): Observable<CsrfTokenResponse> {
    return this.http.get<CsrfTokenResponse>(
      CSRF_ENDPOINT
    );
  }

  getHeaders(): Observable<HttpHeaders> {
    return this.getToken().pipe(
      map((csrf) =>
        new HttpHeaders().set(
          csrf.headerName,
          csrf.token
        )
      )
    );
  }
}