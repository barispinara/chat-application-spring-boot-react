import { SendTwoTone } from "@mui/icons-material";
import { Avatar, Box, Button, InputBase } from "@mui/material";
import React from "react";

const BottomBar: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box flexGrow={1} display={"flex"} alignItems={"center"}>
        <Avatar
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            mr: 1,
          }}
          alt="TEST USERNAME"
        />
        <InputBase
          sx={{
            fontSize: 18,
            pdding: 1,
            width: "100%",
          }}
          autoFocus
          placeholder="Write your message here..."
          fullWidth
        />
      </Box>
      <Box>
        <Button startIcon={<SendTwoTone />} variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default BottomBar;
