import { User } from "../User";
import { Role } from "../Role";

export interface ProjectUser {
  id?: string;
  user: User;
  roles?: Role[];
}
