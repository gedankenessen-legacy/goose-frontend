import { Project } from '../project/Project';
import { State } from '../project/State';
import { User } from '../User';
import { IssueConversationItem } from './IssueConversationItem';
import { IssueDetail } from './IssueDetail';
import { IssueParent } from './IssueParent';
import { IssuePredecessor } from './IssuePredecessor';
import { IssueSuccessor } from './IssueSuccessor';
import { IssueTimeSheet } from './IssueTimeSheet';

export interface Issue {
  id?: string;
  createdAt: Date;
  state?: State;
  project?: Project;
  client?: User;
  author?: User;
  assignedUsers?: User[];
  conversationItems?: IssueConversationItem[];
  timeSheets?: IssueTimeSheet[];
  issueDetail: IssueDetail;
  parentIssue?: IssueParent;
  predecessorIssues?: IssuePredecessor[];
  successorIssues?: IssueSuccessor[];
  relevantDocuments?: string[];
}
