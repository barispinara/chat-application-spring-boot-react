import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const TopBar: React.FC = () => {
  return (
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
          alt="TEST USERNAME"
        />
        <Box ml={1}>
          <Typography variant="h5">TEST USERNAME</Typography>
          <Typography variant="subtitle1">2 min ago</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBar;
