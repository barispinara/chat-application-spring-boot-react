import { Box } from "@mui/material";
import React from "react";
import Sidebar from "../../components/chat/sidebar";
import ChatLayout from "../../components/chat/chat-layout";

const Chat: React.FC = () => {
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
          display: "flex",
          flex: "0 0 30%",
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
