import { State } from "../project/State";
import { Requirement } from "./Requirement";

export interface Issue {
  id: number;
  projectId: number;
  name: string;
  type: string;
  state: State;
  startDate?: Date;
  endDate?: Date;
  expectedTime?: number;
  progress?: number;
  description: string;
  requirementsAccepted?: Requirement;
  requirementsNeeded?: Requirement;
  priority?: number;
  finalComment?: string;
  visible: boolean;
  relevantDocuments?: String[];
  parent?: Issue;
  predecessors?: Issue[];
  successors?: Issue[]
}
