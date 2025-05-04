import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoomService } from "../../services/ChatRoomService";
import { ChatRoom, ChatRoomState } from "../../types/chatRoomTypes";
import { Message } from "../../types/messageTypes";

const initialState: ChatRoomState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
};

export const getChatRoomByUser = createAsyncThunk(
  "chat/user",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ChatRoomService.getChatRoomByUser(userId);
      return response.data as ChatRoom;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Getting chat room by user failed.",
      );
    }
  },
);

export const getChatRoomById = createAsyncThunk(
  "chat",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await ChatRoomService.getChatRoomById(chatId);
      return response.data as ChatRoom;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Getting chat room by id failed",
      );
    }
  },
);

export const createChatRoom = createAsyncThunk(
  "chat/create",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await ChatRoomService.createChatRoom(userId);
      return response.data as ChatRoom;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Error occured while creating chatroom",
      );
    }
  },
);

export const getAllChatRoomsOfUser = createAsyncThunk(
  "chat/user/all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ChatRoomService.getAllChatRoomsOfUser();
      return response.data as ChatRoom[];
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Error occured while getting all chatrooms of user",
      );
    }
  },
);

const chatRoomSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<ChatRoom>) {
      state.activeChat = action.payload;
    },
    updateLastMessage(state, action: PayloadAction<Message>) {
      const chatId = action.payload.chatRoom.id;

      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].latestMessage = action.payload;
      }
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatRoomByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getChatRoomByUser.fulfilled,
        (state, action: PayloadAction<ChatRoom>) => {
          state.loading = false;
          state.activeChat = action.payload;
        },
      )
      .addCase(getChatRoomByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getChatRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getChatRoomById.fulfilled,
        (state, action: PayloadAction<ChatRoom>) => {
          state.loading = false;
          state.activeChat = action.payload;
        },
      )
      .addCase(getChatRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createChatRoom.fulfilled,
        (state, action: PayloadAction<ChatRoom>) => {
          state.loading = false;
          state.activeChat = action.payload;
        },
      )
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllChatRoomsOfUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(
        getAllChatRoomsOfUser.fulfilled,
        (state, action: PayloadAction<ChatRoom[]>) => {
          (state.loading = true), (state.chats = action.payload);
        },
      )
      .addCase(getAllChatRoomsOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveChat, updateLastMessage, clearActiveChat, clearError } =
  chatRoomSlice.actions;
export default chatRoomSlice.reducer;
