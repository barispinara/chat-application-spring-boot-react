import { Add, SearchTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setActiveChat,
  setActiveChatTargetUser,
} from "../../../redux/slices/chatRoomSlice";
import { ChatRoom } from "../../../types/chatRoomTypes";
import { findAndGetUserFullName } from "../../../utils/userUtils";
import UserListTab from "./UserListTab";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { fetchAllUsers } from "../../../redux/slices/authSlice";

const ChatListTab: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { chats } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [isPeopleDialogOpen, setIsPeopleDialogOpen] = useState(false);

  const onButtonClick = (currChatRoom: ChatRoom) => {
    dispatch(setActiveChat(currChatRoom));
    dispatch(
      setActiveChatTargetUser(
        (() => {
          const targetUser = currChatRoom.users.find((cUser) => cUser.id !== user?.id);
          if (targetUser) {
            return { ...targetUser, lastSeen: "" };
          }
          return targetUser;
        })(),
      ),
    );
  };

  const handleOpenPeopleDialog = () => {
    dispatch(fetchAllUsers());
    setIsPeopleDialogOpen(true);
  };

  const handleClosePeopleDialog = () => {
    setIsPeopleDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
        <IconButton
          onClick={handleOpenPeopleDialog}
          sx={{
            p: 1,
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              transform: "scale(1.05)",
            },
          }}
          size="small"
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
      <Box mt={2}>
        <List disablePadding component="div">
          {chats.map((chatItem, index) => (
            <ListItemButton key={index} onClick={() => onButtonClick(chatItem)}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    border: `2px solid ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  {findAndGetUserFullName(chatItem.users, user?.id)[0]}
                </Avatar>
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

      {/* People Dialog */}
      <Dialog
        open={isPeopleDialogOpen}
        onClose={handleClosePeopleDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
            }}
          >
            People
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <UserListTab handleClosePeopleDialog={handleClosePeopleDialog} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChatListTab;
