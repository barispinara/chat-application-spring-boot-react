import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import ChatMessage from "./ChatMessage";
import { useAppSelector } from "../../../redux/hooks";

const ChatLayout: React.FC = () => {
  const { activeChat } = useAppSelector((state) => state.chat);
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
      {activeChat ? (
        <>
          <Box alignItems="center">
            <TopBar />
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <ChatMessage />
          </Box>
          <Divider />
          <BottomBar />
        </>
      ) : (
        <Box alignItems="center" display="flex">
          <Typography variant="h5">Welcome to Chat Application</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatLayout;
