import { Routes } from '@angular/router';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
        import('./features/authentication/login/login')
        .then(m => m.Login)
        },
        {
        path: 'home',
        loadComponent: () =>
        import('./features/home/home')
        .then(m => m.Home)
        },
        {
        path: 'acesso-negado',
        loadComponent: () =>
        import(
        './features/access-denied/access-denied'
        ).then((module) => module.AccessDenied)
        },
        {
        path: 'admin',
        loadChildren: () =>
        import(
        './features/administration/administration.routes'
        ).then(
        (module) => module.administrationRoutes
        )
        },
        {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
        },
        {
        path: '**',
        redirectTo: 'home'
    }
];
