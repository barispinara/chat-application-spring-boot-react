import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import { format, isSameDay, isToday, isYesterday, parseISO } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllMessages } from "../../../redux/slices/messageSlice";
import { Message } from "../../../types/messageTypes";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const ChatMessage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeChat } = useAppSelector((state) => state.chat);
  const { loading, messages, error } = useAppSelector((state) => state.message);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLUListElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (activeChat) {
      dispatch(getAllMessages(activeChat.id));
    }
  }, [dispatch, activeChat]);

  useEffect(() => {
    if (activeChat) {
      setCurrentChatMessages(
        messages[activeChat.id] ? messages[activeChat.id] : [],
      );
    }
  }, [messages, activeChat]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [currentChatMessages]);

  return (
    <Box p={3}>
      {activeChat && (
        <List 
          ref={messagesContainerRef}
          sx={{ 
            overflowY: "auto", 
            maxHeight: "70vh", 
            px: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          {currentChatMessages.map((currMessage, index) => {
            const isOwnMessage = currMessage.sender.username === user?.username;
            const sentAt = parseISO(currMessage.sentAt);
            const showDateLabel =
              index === 0 ||
              !isSameDay(
                sentAt,
                parseISO(currentChatMessages[index - 1].sentAt),
              );

            const getDayLabel = () => {
              if (isToday(sentAt)) return "Today";
              if (isYesterday(sentAt)) return "Yesterday";
              return format(sentAt, "MMMM d, yyyy"); // e.g., May 21, 2025
            };

            return (
              <Box key={index}>
                {showDateLabel && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 2,
                    }}
                  >
                    <Divider sx={{ width: "100%", position: "relative" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.background.paper, 0.8),
                          color: theme.palette.text.primary,
                          borderRadius: 1,
                          position: "relative",
                          top: "-10px",
                        }}
                      >
                        {getDayLabel()}
                      </Typography>
                    </Divider>
                  </Box>
                )}

                <ListItem
                  disableGutters
                  dense
                  sx={{
                    display: "flex",
                    justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: isOwnMessage 
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.text.primary,
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      borderTopLeftRadius: isOwnMessage ? 16 : 4,
                      borderTopRightRadius: isOwnMessage ? 4 : 16,
                      maxWidth: "75%",
                      boxShadow: 1,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                      {currMessage.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        color: theme.palette.text.secondary,
                        mt: 0.5,
                      }}
                    >
                      {format(sentAt, "HH:mm")}
                    </Typography>
                  </Box>
                </ListItem>
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
};
export default ChatMessage;
