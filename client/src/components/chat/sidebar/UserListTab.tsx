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
  Typography,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createChatRoom, setActiveChat, setActiveChatTargetUser } from "../../../redux/slices/chatRoomSlice";
import { User } from "../../../types/authTypes";
import { differenceInSeconds, formatDistanceToNow, parseISO } from "date-fns";

const UserListTab: React.FC<{ handleClosePeopleDialog: () => void }> = ({ handleClosePeopleDialog }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { userList } = useAppSelector((state) => state.auth);
  const { chats } = useAppSelector((state) => state.chat);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  const onButtonClick = (clickedUser: User) => {
    const chatRoom = chats.find((chat) => chat.users.some((user) => user.id === clickedUser.id));
    if (chatRoom) {
      dispatch(setActiveChat(chatRoom));
      let editedClickedUser = clickedUser;
      editedClickedUser.lastSeen = "";
      dispatch(setActiveChatTargetUser(editedClickedUser));
    } else {
      dispatch(createChatRoom(clickedUser.id));
    }
    handleClosePeopleDialog();
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "User last seen information not found";

    try {
      const lastSeenDate = parseISO(lastSeen);
      const secondsDiff = differenceInSeconds(new Date(), lastSeenDate);

      if (secondsDiff < 30) {
        return "Active now";
      }

      const formatted = formatDistanceToNow(lastSeenDate, { addSuffix: true });
      return `Last seen ${formatted}`;
    } catch (e) {
      return "Invalid last seen format";
    }
  };

  const isUserOnline = (lastSeen?: string) => {
    if (!lastSeen) return false;
    try {
      const lastSeenDate = parseISO(lastSeen);
      const secondsDiff = differenceInSeconds(new Date(), lastSeenDate);
      return secondsDiff < 30;
    } catch (e) {
      return false;
    }
  };

  return (
    <Box>
      <TextField
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
            "&.Mui-focused": {
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchTwoTone sx={{ color: theme.palette.primary.main }} />
              </InputAdornment>
            ),
          },
        }}
        placeholder="Search people..."
      />
      <Box>
        <List disablePadding component="div">
          {filteredUsers
            .filter((user) => user.id !== currentUser?.id) // Filter out current user
            .map((user, index) => {
              const isOnline = isUserOnline(user.lastSeen);
              const lastSeenText = getLastSeen(user.lastSeen);
              
              return (
                <ListItemButton
                  key={index}
                  onClick={() => onButtonClick(user)}
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        border: `2px solid ${alpha(
                          isOnline ? theme.palette.success.main : theme.palette.primary.main,
                          0.2
                        )}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {user.firstName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ mr: 1 }}
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {`${user.firstName} ${user.lastName}`}
                        </Typography>
                        {isOnline && (
                          <Chip
                            label="Online"
                            size="small"
                            sx={{
                              height: "20px",
                              backgroundColor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                              fontWeight: 500,
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.75rem",
                              },
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {lastSeenText}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>
    </Box>
  );
};

export default UserListTab;
