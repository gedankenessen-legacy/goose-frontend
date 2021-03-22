import { CompanyUser } from "./CompanyUser";

export interface Company {
  id: number;
  name: string;
  user: CompanyUser;
}
