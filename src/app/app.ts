import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { AuthStore } from './core/auth/auth.store';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('headspace');

  readonly authStore = inject(AuthStore);
  
  private readonly authService = inject(AuthService);
  
  ngOnInit(): void {
  this.authService.loadCurrentUser().subscribe();
  }
}
