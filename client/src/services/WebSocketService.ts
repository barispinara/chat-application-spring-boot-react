import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getStoredUser } from "../helper/storage";

const SOCKET_URL =
  `${import.meta.env.VITE_APP_SERVER_URL}/ws` || "http://localhost:8080/ws";

export class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;

  connect() {
    if (this.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log("Connected to WebSocket");
        this.connected = true;
        // this.subscribeToPersonalChat():
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
      reconnectDelay: 5000,
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribeToPrivateChat() {
    if (!this.client || !this.connected) return;

    const currentUserId = getStoredUser()?.id || "";

    this.client.subscribe(`/chat/user/${currentUserId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      store.dispatch(addMessage(receivedMessage));
    });
  }

  async sendMessage(chatId: string, content: string) {
    if (!this.client || !this.connected) {
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
