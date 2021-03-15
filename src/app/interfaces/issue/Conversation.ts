import User from "../User";
import Requirement from "./Requirement";

interface TimeSheet {
  id: number;
  type: string;
  data: any;
  creatorUser: User;
  linkedRequirement: Requirement;
  createdAt: Date
}

export default TimeSheet;
