import { issueRequirement } from './issueRequirement';

export interface issue {
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  expectedTime: number;
  progress: number;
  description: string;
  requirements?: issueRequirement[];
  requirementsAccepted: boolean;
  requirementsNested: boolean;
  priority: number;
  finalComment?: string;
  visibility: boolean;
  relevantDocuments?: string[];
}
