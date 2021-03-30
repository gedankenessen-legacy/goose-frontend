import { User } from '../User';
import { IssueRequirement } from './IssueRequirement';

export interface IssueConversationItem {
  id?: string;
  type: string;
  data: any;
  crator: User;
  requirements?: IssueRequirement[];
  createdAt: Date;
}
