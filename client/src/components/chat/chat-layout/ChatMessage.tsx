import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import { format, isSameDay, isToday, isYesterday, parseISO } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllMessages } from "../../../redux/slices/messageSlice";
import { Message } from "../../../types/messageTypes";

const ChatMessage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeChat } = useAppSelector((state) => state.chat);
  const { loading, messages, error } = useAppSelector((state) => state.message);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

  return (
    <Box p={3}>
      {activeChat && (
        <List sx={{ overflowY: "auto", maxHeight: "70vh", px: 1 }}>
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
                          backgroundColor: "#f0f0f0",
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
                      backgroundColor: isOwnMessage ? "#DCF8C6" : "#FFFFFF",
                      color: "#000",
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      borderTopLeftRadius: isOwnMessage ? 16 : 4,
                      borderTopRightRadius: isOwnMessage ? 4 : 16,
                      maxWidth: "75%",
                      boxShadow: 1,
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
                        color: "gray",
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
          <div ref={bottomRef} />
        </List>
      )}
    </Box>
  );
};
export default ChatMessage;
