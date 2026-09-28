import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  readonly authStore = inject(AuthStore);

  private readonly authService = inject(AuthService);
    
  logout(): void {
    this.authService.logout().subscribe();
  }
}
