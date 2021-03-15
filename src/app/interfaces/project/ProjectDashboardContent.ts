import User from "../User";

interface ProjectDashboardContent {
  name: string;
  customer: User;
  issues: number;
  issuesOpen: number;
}

export default ProjectDashboardContent;
