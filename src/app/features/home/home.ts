import { Component, inject } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { Navigation } from '../../core/layout/navigation/navigation';
import { RouterLink } from '@angular/router';

@Component({
  imports: [Navigation, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  readonly authStore = inject(AuthStore);
}
