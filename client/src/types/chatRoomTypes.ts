import { User } from "./authTypes";
import { Message } from "./messageTypes";

export interface ChatRoom {
  id: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
  latestMessage: Message;
}

export interface ChatRoomState {
  chats: ChatRoom[];
  activeChat: ChatRoom | null;
  loading: boolean;
  error: string | null;
}
