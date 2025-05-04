import { AxiosResponse } from "axios";
import AxiosApi from "./AxiosApi";

const PATHS = {
  GET_CHATROOM_BY_USER: (userId: string) => `chat/user/${userId}`,
  GET_CHATROOM_BY_ID: (chatId: string) => `chat/${chatId}`,
  CREATE_CHATROOM: (userId: string) => `chat/create/${userId}`,
  GET_ALL_CHATROOMS_OF_USER: `chat/user/all`,
};

export class ChatRoomService {
  public static getChatRoomByUser(userId: string): Promise<AxiosResponse> {
    try {
      return AxiosApi.get(PATHS.GET_CHATROOM_BY_USER(userId));
    } catch (error) {
      throw new Error("Error occured while finding chatroom by user");
    }
  }

  public static createChatRoom(userId: string): Promise<AxiosResponse> {
    try {
      return AxiosApi.post(PATHS.CREATE_CHATROOM(userId));
    } catch (error) {
      throw new Error("Error occured while creating new chatroom");
    }
  }

  public static getChatRoomById(chatId: string): Promise<AxiosResponse> {
    try {
      return AxiosApi.get(PATHS.GET_CHATROOM_BY_ID(chatId));
    } catch (error) {
      throw new Error("Error occured while finding chatroom by id");
    }
  }

  public static getAllChatRoomsOfUser(): Promise<AxiosResponse> {
    try {
      return AxiosApi.get(PATHS.GET_ALL_CHATROOMS_OF_USER);
    } catch (error) {
      throw new Error("Error occured while getting all chatrooms of user");
    }
  }
}
