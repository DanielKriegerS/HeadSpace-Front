import { RoleName } from '../../../core/models/RoleName';
import { UserStatus } from '../../../core/models/UserStatus';

export interface AdminUserSummary {
  id: string;
  username: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  roles: RoleName[];
  createdAt: string;
}

export interface AdminUserDetails {
  id: string;
  username: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  roles: RoleName[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserPage {
  content: AdminUserSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AdminUserFilters {
  search?: string;
  status?: UserStatus;
  role?: RoleName;
  page: number;
  size: number;
  sortBy: AdminUserSortField;
  direction: SortDirection;
}

export type AdminUserSortField =
  | 'createdAt'
  | 'username'
  | 'email'
  | 'status';

export type SortDirection =
  | 'ASC'
  | 'DESC';