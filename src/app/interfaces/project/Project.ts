import ProjectUser from "./ProjectUser";
import State from "./State";

interface Project {
  id: number;
  name: string;
  company_id: number;
  users: Array<ProjectUser>;
  states: Array<State>;
}

export default Project;
