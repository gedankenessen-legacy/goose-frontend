import { User } from "../User";
import { Requirement } from "./Requirement";

export interface Conversation {
  id: string;
  type: string;
  data: any;
  creatorUser: User;
  linkedRequirement: Requirement;
  createdAt: Date
}
