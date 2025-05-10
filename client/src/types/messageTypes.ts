import { User } from "./authTypes";
import { ChatRoom } from "./chatRoomTypes";

export interface Message {
  id: string;
  sentAt: string;
  updatedAt: string;
  isSeen: boolean;
  sender: User;
  content: string;
  chatRoom: ChatRoom;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
}

export interface MessageState {
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}
