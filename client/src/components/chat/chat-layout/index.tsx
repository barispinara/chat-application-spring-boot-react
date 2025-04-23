import { Box, Divider } from "@mui/material";
import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import ChatMessage from "./ChatMessage";

const ChatLayout: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box alignItems="center">
        <TopBar />
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <ChatMessage />
      </Box>
      <Divider />
      <BottomBar />
    </Box>
  );
};

export default ChatLayout;
