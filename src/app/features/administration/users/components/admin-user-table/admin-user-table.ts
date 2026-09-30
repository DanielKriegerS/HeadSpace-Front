import {
  Component,
  input,
  output
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  RoleName
} from '../../../../../core/models/RoleName';

import {
  AdminUserSortField,
  AdminUserSummary,
  SortDirection
} from '../../administration-user.models';

import {
  AdminUserStatusBadge
} from '../admin-user-status-badge/admin-user-status-badge';

export interface AdminUserSortSelection {
  sortBy: AdminUserSortField;
  direction: SortDirection;
}

@Component({
  selector: 'app-admin-user-table',
  standalone: true,
  imports: [RouterLink, AdminUserStatusBadge, DatePipe],
  templateUrl: './admin-user-table.html',
  styleUrl: './admin-user-table.scss'
})
export class AdminUserTable {
  readonly users = input.required<AdminUserSummary[]>();
  readonly sortBy = input.required<AdminUserSortField>();
  readonly direction = input.required<SortDirection>();

  readonly sortChanged =
    output<AdminUserSortSelection>();

  readonly imageErrors = new Set<string>();

  toggleSort(field: AdminUserSortField): void {
    const nextDirection: SortDirection =
      this.sortBy() === field &&
      this.direction() === 'ASC'
        ? 'DESC'
        : 'ASC';

    this.sortChanged.emit({
      sortBy: field,
      direction: nextDirection
    });
  }

  getSortLabel(field: AdminUserSortField): string {
    if (this.sortBy() !== field) {
      return 'Ordenar';
    }

    return this.direction() === 'ASC'
      ? 'Ordem crescente'
      : 'Ordem decrescente';
  }

  getSortSymbol(field: AdminUserSortField): string {
    if (this.sortBy() !== field) {
      return '↕';
    }

    return this.direction() === 'ASC'
      ? '↑'
      : '↓';
  }

  translateRole(role: RoleName): string {
    const translations: Record<RoleName, string> = {
      ROLE_USER: 'Leitor',
      ROLE_AUTHOR: 'Autor',
      ROLE_ADMIN: 'Administrador'
    };

    return translations[role];
  }

  markImageAsFailed(userId: string): void {
    this.imageErrors.add(userId);
  }

  shouldShowImage(user: AdminUserSummary): boolean {
    return (
      Boolean(user.profileImageUrl) &&
      !this.imageErrors.has(user.id)
    );
  }

  getInitial(username: string): string {
    return username
      .trim()
      .charAt(0)
      .toUpperCase();
  }
}