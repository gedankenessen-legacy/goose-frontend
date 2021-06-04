import { IssueDetail } from "./IssueDetail";

export interface IssueParent {
  id?: string;
  name: string;
  issueDetail: IssueDetail;
}
