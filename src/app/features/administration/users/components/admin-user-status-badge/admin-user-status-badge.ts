import {
  Component,
  computed,
  input
} from '@angular/core';

import {
  UserStatus
} from '../../../../../core/models/UserStatus';

@Component({
  selector: 'app-admin-user-status-badge',
  standalone: true,
  templateUrl: './admin-user-status-badge.html',
  styleUrl: './admin-user-status-badge.scss'
})
export class AdminUserStatusBadge {
  readonly status = input.required<UserStatus>();

  readonly label = computed(() =>
    this.status() === 'ACTIVE'
      ? 'Ativo'
      : 'Bloqueado'
  );
}