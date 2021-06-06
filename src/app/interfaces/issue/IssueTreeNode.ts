import { Issue } from "./Issue";

export interface TreeNodeInterface {
    key: string;
    name: string;
    level?: number;
    expand?: boolean;
    children?: TreeNodeInterface[];
    parent?: TreeNodeInterface;
    issue: Issue;
  }