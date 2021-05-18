import { User } from './User';

export interface Message {
  id: string;
  companyId: string;
  projectId: string;
  issueId: string;
  receiver_user: User;
  type: MessageType;
  consented: boolean;
}

export enum MessageType {
  TimeExceeded,
  IssueCancelled,
  RecordedTimeChanged,
  NewConversationItem,
  DeadLineReached,
}
