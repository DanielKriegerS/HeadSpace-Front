import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthenticationLayout } from '../authentication-layout/authentication-layout';

@Component({
  imports: [AuthenticationLayout],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  
  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
