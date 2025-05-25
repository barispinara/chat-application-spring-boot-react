import { SettingsTwoTone } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, Box, IconButton, Tab, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatListTab from "./ChatListTab";
import UserListTab from "./UserListTab";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllChatRoomsOfUser } from "../../../redux/slices/chatRoomSlice";
import { fetchAllUsers } from "../../../redux/slices/authSlice";

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedTabValue, setSelectedTabValue] = useState("1");
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (selectedTabValue === "1") {
      dispatch(getAllChatRoomsOfUser());
    } else if (selectedTabValue === "2") {
      dispatch(fetchAllUsers());
    }
  }, [selectedTabValue, dispatch]);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabSelection: string,
  ) => {
    setSelectedTabValue(newTabSelection);
  };

  return (
    <Box>
      <Box display="flex" alignItems="flex-start">
        <Avatar alt={"Test"} />
        <Box
          sx={{
            ml: 1.5,
            flex: 1,
          }}
        >
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="subtitle1" noWrap>
                Will be implemented
              </Typography>
            </Box>
            <IconButton
              sx={{
                p: 1,
              }}
              size="small"
              color="primary"
            >
              <SettingsTwoTone fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <TabContext value={selectedTabValue}>
        <Box
          sx={{
            "& .MuiTabs-indicator": {
              minHeight: "4px",
              height: "4px",
              boxShadow: "none",
              border: 0,
            },
            "& .MuiTab-root.MuiButtonBase-root": {
              padding: 0,
            },
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <TabList
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Chats" value="1" />
            <Tab label="People" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ChatListTab />
        </TabPanel>
        <TabPanel value="2">
          <UserListTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Sidebar;
