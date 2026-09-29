import {
  ApplicationConfig
} from '@angular/core';

import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration
} from '@angular/common/http';

import {
  provideRouter
} from '@angular/router';

import {
  routes
} from './app.routes';

import {
  BACKEND_ORIGIN
} from './core/http/backend.origin.token';

import {
  credentialsInterceptor
} from './core/http/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([
        credentialsInterceptor
      ])
    ),

    {
      provide: BACKEND_ORIGIN,
      useValue: 'http://localhost:8080'
    }
  ]
};