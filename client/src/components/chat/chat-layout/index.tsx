import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect } from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import ChatMessage from "./ChatMessage";
import { useAppSelector } from "../../../redux/hooks";
import webSocketService from "../../../services/WebSocketService";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import PulseIcon from "../../../components/icons/PulseIcon";

const ChatLayout: React.FC = () => {
  const { activeChat, activeChatTargetUser } = useAppSelector(
    (state) => state.chat,
  );
  const theme = useTheme();

  useEffect(() => {
    if (activeChat && activeChatTargetUser) {
      webSocketService.subscribeToPrivateChat(
        activeChat.id,
        activeChatTargetUser?.username,
      );
    }

    return () => {
      webSocketService.unsubscribeFromChatRoom();
    };
  }, [activeChat]);

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
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            }}
          >
            <TopBar />
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <ChatMessage />
          </Box>
          <Divider />
          <BottomBar />
        </>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            p: 4,
            textAlign: "center",
            animation: "fadeIn 0.5s ease-in",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <PulseIcon
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pulse
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Welcome to Pulse Chat
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            Start a conversation by selecting a contact from your chat list or add new people to connect with.
          </Typography>
          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
              }}
            >
              💡 Tip: Click the "+" button in the sidebar to start a new conversation
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatLayout;
