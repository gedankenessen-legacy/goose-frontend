import { CompanyUser } from "./CompanyUser";

export interface Company {
  id: string;
  name: string;
  user: CompanyUser;
}
