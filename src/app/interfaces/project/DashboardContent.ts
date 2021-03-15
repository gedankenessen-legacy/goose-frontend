import User from "../User";

interface DashboardContent {
  name: string;
  customer: User;
  issues: number;
  issuesOpen: number;
}

export default DashboardContent;
