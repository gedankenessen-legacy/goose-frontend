import { User } from '../User';
import { IssueRequirement } from './IssueRequirement';

export interface IssueConversationItem {
  id?: string;
  type?: string;
  data: any;
  stateChange?: any;
  expectedTime?: any;
  creator: User;
  requirements?: IssueRequirement[];
  createdAt: Date;
}
