import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStoredToken, getStoredUser } from "../helper/storage";
import AuthErrorListener from "../listener/AuthErrorListener";

const SOCKET_URL = import.meta.env.VITE_APP_SERVER_URL
  ? `${import.meta.env.VITE_APP_SERVER_URL}/ws`
  : "http://localhost:8080/ws";

export class WebSocketService {
  private client: Client | null = null;
  private token: string | null = getStoredToken();

  connect() {
    if (this.client || !this.token) return;
    this.client = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(`${SOCKET_URL}?token=${this.token}`);
        return socket;
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
    const currentUserUsername = getStoredUser()?.username || "";
    this.client.subscribe(`/app/message/notification`, (message) => {
      const notification = JSON.parse(message.body);
      console.log(`Received new notification ${notification}`);
    });
  }

  subscribeToPrivateChat(chatroomId: string) {
    if (!this.client?.connected) return;

    this.client.subscribe(`/topic/message/create/${chatroomId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      console.log(`Received new message ${receivedMessage}`);
    });
  }

  async sendMessage(chatId: string, content: string) {
    if (!this.client?.connected) {
      console.error("WebSocket not connected");
      return;
    }

    const userId = getStoredUser()?.id || "";

    try {
      this.client.publish({
        destination: "/app/message/create",
        body: JSON.stringify({
          chatId,
          content,
          senderId: userId,
          timeStamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
