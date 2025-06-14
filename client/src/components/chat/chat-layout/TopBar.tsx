import { alpha, Avatar, Box, Typography, useTheme } from "@mui/material";
import { differenceInSeconds, formatDistanceToNow, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

const TopBar: React.FC = () => {
  const theme = useTheme();
  const { activeChat, activeChatTargetUser } = useAppSelector(
    (state) => state.chat,
  );

  // State to force re-render every 15 seconds for last seen updates
  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every 15 seconds to refresh last seen display
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const renderLastSeen = (lastSeen?: string) => {
    console.log(lastSeen)
    if (lastSeen === null || lastSeen === undefined) return "User last seen information not found";
    if (lastSeen === "") return "";

    try {
      const lastSeenDate = parseISO(lastSeen);
      const secondsDiff = differenceInSeconds(new Date(), lastSeenDate);

      if (secondsDiff < 30) {
        return "online";
      }

      const formatted = formatDistanceToNow(lastSeenDate, { addSuffix: true });
      return `Last seen ${formatted}`;
    } catch (e) {
      return "Invalid last seen format";
    }
  };

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
                border: `2px solid ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
                transition: "all 0.3s ease",
              }}
              alt={activeChatTargetUser?.firstName}
            >
              {activeChatTargetUser?.firstName[0]}
            </Avatar>
            <Box ml={1}>
              <Typography variant="h5">
                {activeChatTargetUser?.firstName}{" "}
                {activeChatTargetUser?.lastName}
              </Typography>
              <Typography variant="subtitle1">
                {renderLastSeen(activeChatTargetUser?.lastSeen)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </div>
  );
};

export default TopBar;
