import { User } from "../User";

interface ProjectDashboardContent {
  id: string;
  name: string;
  customer: User;
  issues: number;
  issuesOpen: number;
  hasWritePermission: boolean;
}

export default ProjectDashboardContent;
