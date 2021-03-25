import { User } from "../User";

interface ProjectDashboardContent {
  id: number;
  name: string;
  customer: User;
  issues: number;
  issuesOpen: number;
}

export default ProjectDashboardContent;
