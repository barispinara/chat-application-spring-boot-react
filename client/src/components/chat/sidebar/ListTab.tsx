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
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import { getAllChatRoomsOfUser } from "../../../redux/slices/chatRoomSlice";

const ListTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, chats } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllChatRoomsOfUser());
  }, []);

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
      />{" "}
      <Box mt={2}>
        <List disablePadding component="div">
          {chats.map((chatItem, index) => (
            <ListItemButton key={index}>
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
                primary={
                  chatItem.users.find((cUser) => cUser.id !== user?.id)
                    ?.firstName
                }
                secondary={chatItem.latestMessage.content}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ListTab;
