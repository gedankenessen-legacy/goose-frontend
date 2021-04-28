import { User } from './User';

export interface Message {
  id: string;
  receiver_user: User;
  type: string;
  consented: any;
  data: any;
}
