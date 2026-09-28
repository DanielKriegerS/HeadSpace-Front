import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AuthStore } from '../../core/auth/auth.store';
import { Navigation } from '../../core/layout/navigation/navigation';

@Component({
  imports: [Navigation],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  readonly authStore = inject(AuthStore);
}
