import { Box, useTheme, alpha, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import ChatLayout from "../../components/chat/chat-layout";
import Sidebar from "../../components/chat/sidebar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import webSocketService from "../../services/WebSocketService";
import { updateLastMessage } from "../../redux/slices/chatRoomSlice";
import { Message } from "../../types/messageTypes";

const Chat: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && token && user) {
      webSocketService.connect(
        () => token,
        () => user,
      );
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
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        flex: 1,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%)`,
          animation: "pulse 8s infinite",
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
            "50%": {
              transform: "scale(1.5)",
              opacity: 0.2,
            },
            "100%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          flex: "0 0 30%",
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          borderRadius: "16px 0 0 16px",
          margin: "16px 0 16px 16px",
          boxShadow: `0 8px 32px 0 ${alpha(
            theme.palette.primary.main,
            0.1
          )}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: `0 8px 32px 0 ${alpha(
              theme.palette.primary.main,
              0.2
            )}`,
          },
          overflow: "hidden",
        }}
      >
        <Sidebar />
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: "1",
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          borderRadius: "0 16px 16px 0",
          margin: "16px 16px 16px 0",
          boxShadow: `0 8px 32px 0 ${alpha(
            theme.palette.primary.main,
            0.1
          )}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: `0 8px 32px 0 ${alpha(
              theme.palette.primary.main,
              0.2
            )}`,
          },
          overflow: "hidden",
        }}
      >
        <ChatLayout />
      </Box>
    </Box>
  );
};

export default Chat;
