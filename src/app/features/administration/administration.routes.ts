import { Routes } from '@angular/router';

import {
  adminGuard
} from '../../core/auth/admin.guard';

export const administrationRoutes: Routes = [
  {
    path: '',
    canActivate: [
      adminGuard
    ],
    canActivateChild: [
      adminGuard
    ],
    loadComponent: () =>
      import(
        './layout/admin-shell/admin-shell'
      ).then((module) => module.AdminShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios'
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import(
            './users/pages/admin-user-list/admin-user-list'
          ).then(
            (module) => module.AdminUserList
          )
      },
      {
        path: 'usuarios/:userId',
        loadComponent: () =>
          import(
            './users/pages/admin-user-details/admin-user-details'
          ).then(
            (module) => module.AdminUserDetailsPage
          )
      },
      {
        path: '**',
        redirectTo: 'usuarios'
      }
    ]
  }
];