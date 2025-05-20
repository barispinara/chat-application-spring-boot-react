import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ChatLayout from "../../components/chat/chat-layout";
import Sidebar from "../../components/chat/sidebar";
import { useAppDispatch } from "../../redux/hooks";
import webSocketService from "../../services/WebSocketService";
import { updateLastMessage } from "../../redux/slices/chatRoomSlice";
import { Message } from "../../types/messageTypes";

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Connect to WebSocket when component mounts
    webSocketService.connect();
    // Clean up WebSocket connection when component unmounts
    return () => {
      webSocketService.disconnect();
    };
  }, []);

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
