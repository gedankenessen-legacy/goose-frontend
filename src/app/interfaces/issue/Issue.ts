import { State } from "../project/State";
import { Requirement } from "./Requirement";

/*export interface Issue {
  id: string;
  name: string;
  type: string;
  authorId: string; 
  stateId: string;
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
  relevantDocuments?: string[];
  parent?: Issue;
  predecessors?: Issue[];
  successors?: Issue[]
  issueDetail: {
    name: String;
    type: String;
    startDate: Date;
    endDate: Date;
    expectedTime: Number;
    progress: Number;
    priority: Number;
  }
}*/

export interface Issue {
  
    state: {
      id: string,
      name: string,
      phase: string
    },
    project: {
      id: string,
      name: string
    },
    client: {
      id: string,
      firstname: string,
      lastname: string
    },
    author: {
      id: string,
      firstname: string,
      lastname: string
    },
    assignedUsers: [
      {
        id: string,
        firstname: string,
        lastname: string
      }
    ],
    conversationItems: [
      {
        id: string,
        creator: {
          id: string,
          firstname: string,
          lastname: string
        },
        type: string,
        data: string,
        requirements: [
          {
            id: string,
            requirement: string
          }
        ],
        createdAt: Date,
      },
    ],
   
    issueDetail: {
      name: string,
      type: string,
      startDate: Date,
      endDate: Date,
      expectedTime: 0,
      progress: 0,
      description: string,
      requirements: [
        {
          id: string,
          requirement: string
        }
      ],
      requirementsAccepted: true,
      requirementsNeeded: true,
      priority: 0,
      visibility: true,
      relevantDocuments: [
        string
      ]
    },
}
