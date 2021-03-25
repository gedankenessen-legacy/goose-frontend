import { User } from "../User";

export interface TimeSheet {
  id: string;
  user: User;
  start: Date;
  end: Date
}
