import { State } from '../project/State';

export interface IssueChildren {
  id?: string;
  name: string;
  state?: State;
}
