import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [
    RouterLink
  ],
  selector: 'app-access-denied',
  styleUrl: './access-denied.scss',
  templateUrl: './access-denied.html',
})
export class AccessDenied {}
