import { SendTwoTone } from "@mui/icons-material";
import { Avatar, Box, Button, InputBase } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import webSocketService from "../../../services/WebSocketService";

const BottomBar: React.FC = () => {
  const { activeChat } = useAppSelector((state) => state.chat);
  const [messageContent, setMessageContent] = useState("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageContent.trim() !== "" && activeChat) {
      webSocketService.sendMessage(activeChat.id, messageContent);
      setMessageContent("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      {activeChat ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box flexGrow={1} display={"flex"} alignItems={"center"}>
            <Avatar
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                mr: 1,
              }}
              alt="TEST USERNAME"
            />
            <InputBase
              sx={{
                fontSize: 18,
                pdding: 1,
                width: "100%",
              }}
              autoFocus
              value={messageContent}
              onChange={handleMessageChange}
              placeholder="Write your message here..."
              fullWidth
            />
          </Box>
          <Box>
            <Button
              startIcon={<SendTwoTone />}
              variant="contained"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};

export default BottomBar;
