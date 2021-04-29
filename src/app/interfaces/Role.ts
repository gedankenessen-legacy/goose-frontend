export interface Role {
  id: string;
  name: string;
}

export const AdminRole: string = 'Admin';
export const CompanyRole: string = 'Firma';
export const CustomerRole: string = 'Kunde';
export const ProjectLeaderRole: string = 'Projektleiter';
export const EmployeeRole: string = 'Mitarbeiter';
export const ReadonlyEmployeeRole: string = 'Mitarbeiter (Lesend)';
