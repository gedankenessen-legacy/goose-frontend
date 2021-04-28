export interface IssueDetail {
  name: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  expectedTime?: number;
  progress?: number;
  description: string;
  requirementsAccepted?: boolean;
  requirementsNeeded?: boolean;
  priority?: number;
  visibility: boolean;
  relevantDocuments?: string[];
}
