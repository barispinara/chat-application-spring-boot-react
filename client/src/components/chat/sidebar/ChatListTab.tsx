import { SearchTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setActiveChat } from "../../../redux/slices/chatRoomSlice";
import { ChatRoom } from "../../../types/chatRoomTypes";
import { findAndGetUserFullName } from "../../../utils/userUtils";
import webSocketService from "../../../services/WebSocketService";

const ChatListTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  const onButtonClick = (currChatRoom: ChatRoom) => {
    dispatch(setActiveChat(currChatRoom));
    // webSocketService.subscribeToPrivateChat(currChatRoom.id);
  };

  return (
    <Box>
      <TextField
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchTwoTone />
              </InputAdornment>
            ),
          },
        }}
        placeholder="Search..."
      />
      <Box mt={2}>
        <List disablePadding component="div">
          {chats.map((chatItem, index) => (
            <ListItemButton key={index} onClick={() => onButtonClick(chatItem)}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                sx={{ mr: 1 }}
                slotProps={{
                  primary: {
                    variant: "h5",
                    noWrap: true,
                  },
                  secondary: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "15vw",
                    noWrap: true,
                  },
                }}
                primary={findAndGetUserFullName(chatItem.users, user?.id)}
                secondary={
                  chatItem.latestMessage
                    ? chatItem.latestMessage.content
                    : "No message found..."
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatListTab;
