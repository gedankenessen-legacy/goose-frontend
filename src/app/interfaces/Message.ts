import { User } from "./User";

export interface Message {
  id: number;
  receiver_user: User;
  type: string;
  consented: any;
  data: any;
}
