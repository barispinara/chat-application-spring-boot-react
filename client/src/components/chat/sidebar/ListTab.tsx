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

const ListTab: React.FC = () => {
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
          <ListItemButton selected>
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
              primary="Test Surname"
              secondary="Lorem Ipsum"
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};

export default ListTab;
