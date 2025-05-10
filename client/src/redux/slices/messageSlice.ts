import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Message,
  MessageState,
  SendMessageRequest,
} from "../../types/messageTypes";
import { MessageService } from "../../services/MessageService";

const initialState: MessageState = {
  messages: {},
  loading: false,
  error: null,
};

export const getAllMessages = createAsyncThunk<
  { chatId: string; data: Message[] },
  string,
  { rejectValue: any }
>("message/all", async (chatId: string, { rejectWithValue }) => {
  try {
    const response = await MessageService.getAllMessages(chatId);
    return { chatId, data: response.data };
  } catch (error: any) {
    return rejectWithValue(
      error.response.data.message ||
        error.message ||
        "Get all message operation failed",
    );
  }
});

export const sendMessage = createAsyncThunk(
  "message/create",
  async (credentials: SendMessageRequest, { rejectWithValue }) => {
    try {
      const response = await MessageService.sendMessage(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Error occured while sending message",
      );
    }
  },
);

export const getLatestMessage = createAsyncThunk(
  "message",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await MessageService.getLatestMessage(chatId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message ||
          error.message ||
          "Error occured while getting latest message",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages(state, action: PayloadAction<string>) {
      delete state.messages[action.payload];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.chatId] = action.payload.data;
      })
      .addCase(getAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          const chatId = action.payload.chatRoom.id;

          if (!state.messages[chatId]) {
            state.messages[chatId] = [];
          }

          state.messages[chatId].push(action.payload);
        },
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getLatestMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getLatestMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          const chatId = action.payload.chatRoom.id;

          if (!state.messages[chatId]) {
            state.messages[chatId] = [];
          }

          state.messages[chatId].push(action.payload);
        },
      )
      .addCase(getLatestMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages, clearError } = messageSlice.actions;
export default messageSlice.reducer;
