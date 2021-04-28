import { Role } from '../Role';

export interface RegisterContentCustomer {
  userId?: string;
  firstname: string;
  lastname: string;
  password: string;
  roles: Role[];
}
