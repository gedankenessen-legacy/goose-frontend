import { User } from '../User';
import { Role } from '../Role';

export interface CompanyUser {
  id?: string;
  user: User;
  roles?: Role[];
}
