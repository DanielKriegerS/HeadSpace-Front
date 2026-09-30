import { Component, computed, inject, signal } from '@angular/core';
import { AuthStore } from '../../auth/auth.store';
import { AuthService } from '../../auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-navigation',
  styleUrl: './navigation.scss',
  templateUrl: './navigation.html',
})
export class Navigation {
  readonly authStore = inject(AuthStore);
  readonly isCollapsed = signal(false);

  readonly isAdmin = computed(() =>
    this.authStore
      .currentUser()
      ?.roles.includes('ROLE_ADMIN') ?? false
  );

  private readonly authService = inject(AuthService);

  toggleNavigation(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
