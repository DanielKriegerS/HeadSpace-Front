import {
  Component,
  input
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authentication-layout',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './authentication-layout.html',
  styleUrl: './authentication-layout.scss'
})
export class AuthenticationLayout {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
}