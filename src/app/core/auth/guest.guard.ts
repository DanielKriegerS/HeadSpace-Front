import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

import {
  filter,
  map,
  take
} from 'rxjs';

import { AuthStore } from './auth.store';

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return toObservable(store.status).pipe(
    filter((status) => status !== 'INITIALIZING'),
    take(1),
    map((status) => {
      if (status === 'AUTHENTICATED') {
        return router.createUrlTree(['/home']);
      }

      return true;
    })
  );
};