import User from "../User";
import Role from "../Role";

interface ProjectUser {
  id: number;
  user: User;
  roles?: Array<Role>;
}

export default ProjectUser;
