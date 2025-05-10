import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { User } from "../../../types/authTypes";

const TopBar: React.FC = () => {
  const { activeChat } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [targetUser, setTargetUser] = useState<User>();

  useEffect(() => {
    if (activeChat) {
      setTargetUser(activeChat.users.find((cUser) => cUser.id !== user?.id));
    }
  }, [activeChat]);

  return (
    <div>
      {activeChat ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 50,
                height: 50,
              }}
              alt={targetUser?.firstName}
            />
            <Box ml={1}>
              <Typography variant="h5">
                {targetUser?.firstName} {targetUser?.lastName}
              </Typography>
              <Typography variant="subtitle1">
                Last Seen Information Will Be Implemented
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};

export default TopBar;
