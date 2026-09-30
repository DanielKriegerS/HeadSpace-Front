import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  toSignal
} from '@angular/core/rxjs-interop';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  map
} from 'rxjs';

import {
  AuthService
} from '../../../core/auth/auth.service';

import {
  AuthenticationLayout
} from '../authentication-layout/authentication-layout';

import {
  mapLoginError
} from '../authentication-error/login-error.mapper';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthenticationLayout
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly errorCode = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('error'))
    ),
    {
      initialValue: null
    }
  );

  readonly loginError = computed(() =>
    mapLoginError(this.errorCode())
  );

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  dismissError(): void {
    void this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          error: null
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      }
    );
  }
}