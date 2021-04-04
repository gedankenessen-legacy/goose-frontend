import { Project } from '../project/Project';
import { State } from '../project/State';
import { User } from '../User';
import { IssueDetail } from './IssueDetail';

export interface Issue {
  id?: string;
  createdAt: Date;
  state?: State;
  project?: Project;
  client?: User;
  author?: User;
  issueDetail: IssueDetail;
}
