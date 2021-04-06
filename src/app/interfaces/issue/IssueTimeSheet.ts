import { User } from '../User';

export interface IssueTimeSheet {
  id?: string;
  user: User;
  start: Date;
  end: Date;
}
