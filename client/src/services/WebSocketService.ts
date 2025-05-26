import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStoredToken } from "../helper/storage";
import { updateLastMessage } from "../redux/slices/chatRoomSlice";
import { addMessage } from "../redux/slices/messageSlice";
import { store } from "../redux/store";

const SOCKET_URL = import.meta.env.VITE_APP_SERVER_URL
  ? `${import.meta.env.VITE_APP_SERVER_URL}/ws`
  : "http://localhost:8080/ws";

export class WebSocketService {
  private client: Client | null = null;
  private token: String | null = null;
  private privateChatSubscription: StompSubscription | null = null;
  private currentActiveChatRoomId: string | null = null;

  connect(tokenArgs: string) {
    this.token = tokenArgs;
    if (this.client || !this.token) return;
    this.client = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(`${SOCKET_URL}?token=${this.token}`);
        return socket;
      },
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        this.subscribeToNotification();
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
      onWebSocketError: () => {
        console.error("ERROR");
      },
      reconnectDelay: 5000,
    });
    this.client.activate();
  }

  disconnect() {
    if (this.client?.connected) {
      this.client?.deactivate();
    }
  }

  subscribeToNotification() {
    if (!this.client?.connected) return;
    this.client.subscribe(
      `/user/notification`,
      (message) => {
        const notification = JSON.parse(message.body);
        console.log(`Received new notification ${notification}`);
        store.dispatch(addMessage(notification));
        store.dispatch(updateLastMessage(notification));
      },
      {
        Authorization: `Bearer ${this.token}`,
      },
    );
  }

  subscribeToPrivateChat(chatroomId: string) {
    if (!this.client?.connected) return;

    if (
      this.privateChatSubscription &&
      this.currentActiveChatRoomId !== chatroomId
    ) {
      this.unsubscribeFromChatRoom();
    }

    this.privateChatSubscription = this.client.subscribe(
      `/topic/messages/${chatroomId}`,
      (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log(`Received new message ${receivedMessage.content}`);
        store.dispatch(addMessage(receivedMessage));
        store.dispatch(updateLastMessage(receivedMessage));
      },
      {
        Authorization: `Bearer ${this.token}`,
      },
    );
    this.currentActiveChatRoomId = chatroomId;
  }

  unsubscribeFromChatRoom() {
    if (this.privateChatSubscription) {
      this.privateChatSubscription.unsubscribe();
      this.privateChatSubscription = null;
      this.currentActiveChatRoomId = null;
    }
  }

  async sendMessage(chatId: string, content: string) {
    if (!this.client?.connected) {
      console.error("WebSocket not connected");
      return;
    }

    const messagePayload = {
      chatId,
      content,
    };

    try {
      this.client.publish({
        destination: `/app/create/${chatId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
