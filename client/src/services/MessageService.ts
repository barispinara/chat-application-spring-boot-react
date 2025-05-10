import { AxiosResponse } from "axios";
import { SendMessageRequest } from "../types/messageTypes";
import AxiosApi from "./AxiosApi";

const PATHS = {
  SEND_MESSAGE: "/message/create",
  GET_ALL_MESSAGES: (chatId: string) => `/message/all/${chatId}`,
  GET_LATEST_MESSAGE: (chatId: string) => `/message/${chatId}`,
};

export class MessageService {
  public static sendMessage(
    sendMessageRequest: SendMessageRequest,
  ): Promise<AxiosResponse> {
    try {
      return AxiosApi.post(PATHS.SEND_MESSAGE, sendMessageRequest);
    } catch (error) {
      throw new Error("Error while sending message");
    }
  }

  public static getAllMessages(chatId: string): Promise<AxiosResponse> {
    try {
      return AxiosApi.get(PATHS.GET_ALL_MESSAGES(chatId));
    } catch (error) {
      throw new Error("Error occured while getting all messages");
    }
  }

  public static getLatestMessage(chatId: string): Promise<AxiosResponse> {
    try {
      return AxiosApi.get(PATHS.GET_LATEST_MESSAGE(chatId));
    } catch (error) {
      throw new Error("Error occured while getting latest message");
    }
  }
}
