import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { credentialsInterceptor } from './core/http/credentials.interceptor';
import { API_BASE_URL } from './core/http/api-base-url.token';
import { BACKEND_ORIGIN } from './core/http/backend.origin.token';

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