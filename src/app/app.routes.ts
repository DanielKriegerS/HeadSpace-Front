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
        path: '**',
        redirectTo: 'home'
    }
];
