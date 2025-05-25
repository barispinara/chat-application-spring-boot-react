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
import { createChatRoom } from "../../../redux/slices/chatRoomSlice";
import { User } from "../../../types/authTypes";

const UserListTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userList } = useAppSelector((state) => state.auth);

  const onButtonClick = (clickedUser: User) => {
    dispatch(createChatRoom(clickedUser.id));
  };

  // TODO: ChatList and UserList tab has same SearchField, it needs to be united with search component
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
          {userList.map((user, index) => (
            <ListItemButton key={index} onClick={() => onButtonClick(user)}>
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
                }}
                primary={`${user.firstName} ${user.lastName}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default UserListTab;
