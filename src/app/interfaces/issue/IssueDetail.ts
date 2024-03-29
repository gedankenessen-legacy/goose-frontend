import { IssueRequirement } from './IssueRequirement';

export interface IssueDetail {
  name: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  expectedTime?: number;
  totalWorkTime?: number;
  progress?: number;
  description: string;
  requirements?: IssueRequirement[];
  requirementsAccepted?: boolean;
  requirementsSummaryCreated?: boolean;
  requirementsNeeded?: boolean;
  priority?: number;
  visibility: boolean;
  relevantDocuments?: string[];
}
