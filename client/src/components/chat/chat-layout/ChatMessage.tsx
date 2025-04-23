import { ScheduleTwoTone } from "@mui/icons-material";
import { Avatar, Box, Card, Divider, styled, Typography } from "@mui/material";
import React from "react";

const DividerWrapper = styled(Divider)(`
    .MuiDivider-wrapper {
        border-radius: 4px;
        text-transform: none;
        background: #f5f5f5;
        color: #121212;
        font-size: 13px;
    }
`);

const CardWrapperPrimary = styled(Card)(`
  background: #1976d2;
  color: #ffffff;
  padding: 16px;
  border-radious: 16px;
  border-top-right-radius: 4px;
  max-width: 380px;
  display: inline-flex;
`);

const CardWrapperSecondary = styled(Card)(`
    background: #424242;
    color: #ffffff;
    padding: 16px;
    border-radius: 16px;
    border-top-left-radius: 4px;
    max-width: 380px;
    display: inline-flex;
`);

const ChatMessage: React.FC = () => {
  return (
    <Box p={3}>
      <DividerWrapper>2 min ago</DividerWrapper>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          py: 3,
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
            justifyContent: "flex-start",
            ml: 2,
          }}
        >
          <CardWrapperSecondary>Test Message</CardWrapperSecondary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ScheduleTwoTone
              sx={{
                mr: 0.5,
              }}
              fontSize="small"
            />
            2 min ago
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="flex-end"
        py={3}
      >
        <Box
          display="flex"
          alignItems="flex-end"
          flexDirection="column"
          justifyContent="flex-end"
          mr={2}
        >
          <CardWrapperPrimary>
            Yes, I'll email them right now. I'll let you know once the remaining
            invoices are done.
          </CardWrapperPrimary>
          <Typography
            variant="subtitle1"
            sx={{
              pt: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ScheduleTwoTone
              sx={{
                mr: 0.5,
              }}
              fontSize="small"
            />
            2 min ago
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            width: 50,
            height: 50,
          }}
          alt="TEST USERNAME"
        />
      </Box>
      <DividerWrapper>2 min ago</DividerWrapper>
    </Box>
  );
};

export default ChatMessage;
