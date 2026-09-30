import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  toObservable
} from '@angular/core/rxjs-interop';

import {
  filter,
  map,
  take
} from 'rxjs';

import { AuthStore } from './auth.store';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.status).pipe(
    filter((status) => status !== 'INITIALIZING'),
    take(1),
    map((status) => {
      if (status !== 'AUTHENTICATED') {
        return router.createUrlTree(['/home']);
      }

      const currentUser = authStore.currentUser();

      if (!currentUser) {
        return router.createUrlTree(['/home']);
      }

      const isAdmin = currentUser.roles.includes(
        'ROLE_ADMIN'
      );

      return isAdmin
        ? true
        : router.createUrlTree(['/acesso-negado']);
    })
  );
};