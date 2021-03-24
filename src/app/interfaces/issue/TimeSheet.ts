import { User } from "../User";

export interface TimeSheet {
  id: number;
  user: User;
  start: Date;
  end: Date
}

