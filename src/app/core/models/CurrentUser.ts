import { RoleName } from "./RoleName";

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  profileImageUrl: string | null;
  status: 'ACTIVE' | 'BANNED';
  roles: RoleName[];
  createdAt: string;
}