import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ChatLayout from "../../components/chat/chat-layout";
import Sidebar from "../../components/chat/sidebar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import webSocketService from "../../services/WebSocketService";
import { updateLastMessage } from "../../redux/slices/chatRoomSlice";
import { Message } from "../../types/messageTypes";

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      webSocketService.connect(token);
    }
    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    const handleMessageUpdate = (e: CustomEvent<Message>) => {
      dispatch(updateLastMessage(e.detail));
    };
    window.addEventListener(
      "new-message",
      handleMessageUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "new-message",
        handleMessageUpdate as EventListener,
      );
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: "0 0 30%",
          borderRight: 1,
        }}
      >
        <Sidebar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: "1",
        }}
      >
        <ChatLayout />
      </Box>
    </Box>
  );
};

export default Chat;
