import { IssueDetail } from './IssueDetail';

export interface Issue {
  id?: string;
  createdAt: Date;
  stateId?: string;
  projectId?: string;
  clientId?: string;
  authorId?: string;
  issueDetail: IssueDetail;
}
