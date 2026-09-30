import { RoleName } from "./RoleName";
import { UserStatus } from "./UserStatus";

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  roles: RoleName[];
  createdAt: string;
}