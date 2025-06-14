import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  setActiveChatTargetUser,
  updateLastMessage,
} from "../redux/slices/chatRoomSlice";
import { addMessage } from "../redux/slices/messageSlice";
import { store } from "../redux/store";
import { User } from "../types/authTypes";

const SOCKET_URL = import.meta.env.VITE_APP_SERVER_URL
  ? `${import.meta.env.VITE_APP_SERVER_URL}/ws`
  : "http://localhost:8080/ws";

const HEARTBEAT_INTERVAL = import.meta.env.VITE_APP_HEARTBEAT_INTERVAL
  ? Number(import.meta.env.VITE_APP_HEARTBEAT_INTERVAL)
  : 30000;

export class WebSocketService {
  private client: Client | null = null;
  private getToken: () => string | null = () => null;
  private privateChatSubscription: StompSubscription | null = null;
  private lastSeenSubscription: StompSubscription | null = null;
  private notificationSubscription: StompSubscription | null = null;
  private currentActiveChatRoomId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  connect(getToken: () => string | null, getUser: () => User | null) {
    this.getToken = getToken;
    if (this.client || !this.getToken()) return;
    this.client = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(`${SOCKET_URL}?token=${this.getToken()}`);
        return socket;
      },
      connectHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      heartbeatIncoming: 20000, // Server heartbeat
      heartbeatOutgoing: 20000, // Client heartbeat
      onConnect: () => {
        console.log("Connected to WebSocket");
        this.subscribeToNotification(getUser);
        this.startHeartbeat();
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        this.stopHeartbeat();
        this.client = null;
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
      this.stopHeartbeat();
      this.unsubscribeFromChatRoom();
      this.unsubscribeFromNotification();
      this.client?.deactivate();
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, HEARTBEAT_INTERVAL);

    // Send initial heartbeat;
    this.sendHeartbeat();
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendHeartbeat() {
    if (!this.client?.connected) return;

    try {
      this.client.publish({
        destination: "/app/heartbeat",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error sending heartbeat", error);
    }
  }

  subscribeToNotification(getUser: () => User | null) {
    if (!this.client?.connected) return;
    this.notificationSubscription = this.client.subscribe(
      `/topic/notification/${getUser()?.username}`,
      (message) => {
        const notification = JSON.parse(message.body);
        store.dispatch(addMessage(notification));
        store.dispatch(updateLastMessage(notification));
      },
      {
        Authorization: `Bearer ${this.getToken()}`,
      },
    );
  }

  subscribeToPrivateChat(chatroomId: string, activeChatTargetUsername: string) {
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
        store.dispatch(addMessage(receivedMessage));
        store.dispatch(updateLastMessage(receivedMessage));
      },
      {
        Authorization: `Bearer ${this.getToken()}`,
      },
    );
    this.subscribeToLastSeen(activeChatTargetUsername);

    this.currentActiveChatRoomId = chatroomId;
  }

  private subscribeToLastSeen(targetUsername: string) {
    if (!this.client?.connected) return;

    if (this.lastSeenSubscription) this.lastSeenSubscription.unsubscribe();

    this.lastSeenSubscription = this.client.subscribe(
      `/topic/lastseen/${targetUsername}`,
      (message) => {
        const lastSeenUserData = JSON.parse(message.body);
        store.dispatch(setActiveChatTargetUser(lastSeenUserData));
      },
      {
        Authorization: `Bearer ${this.getToken()}`,
      },
    );
  }

  unsubscribeFromChatRoom() {
    if (this.privateChatSubscription) {
      this.privateChatSubscription.unsubscribe();
      this.privateChatSubscription = null;
    }

    if (this.lastSeenSubscription) {
      this.lastSeenSubscription.unsubscribe();
      this.lastSeenSubscription = null;
    }

    this.currentActiveChatRoomId = null;
  }

  unsubscribeFromNotification() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
      this.notificationSubscription = null;
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
          Authorization: `Bearer ${this.getToken()}`,
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
