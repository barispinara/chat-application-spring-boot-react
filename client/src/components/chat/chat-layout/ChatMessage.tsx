import { ScheduleTwoTone } from "@mui/icons-material";
import { Avatar, Box, Card, Divider, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllMessages } from "../../../redux/slices/messageSlice";
import { Message } from "../../../types/messageTypes";

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeChat } = useAppSelector((state) => state.chat);
  const { loading, messages, error } = useAppSelector((state) => state.message);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (activeChat) {
      dispatch(getAllMessages(activeChat.id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (activeChat) {
      setCurrentChatMessages(
        messages[activeChat.id] ? messages[activeChat.id] : [],
      );
    }
  }, [messages]);

  return (
    <Box p={3}>
      {activeChat ? (
        currentChatMessages.map((currMessage, index) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                currMessage.sender.username === user?.username
                  ? "flex-start"
                  : "flex-end",
              py: 3,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 50,
                height: 50,
              }}
              alt={currMessage.sender.username}
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
              <CardWrapperSecondary>{currMessage.content}</CardWrapperSecondary>
              <Typography
                variant="subtitle1"
                sx={{
                  pt: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ScheduleTwoTone sx={{ mr: 0.5 }} fontSize="small" />
                {currMessage.sentAt}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <></>
      )}
    </Box>
  );
  {
    /* <Box p={3}> */
  }
  {
    /*   <DividerWrapper>2 min ago</DividerWrapper> */
  }
  {
    /*   <Box */
  }
  {
    /*     sx={{ */
  }
  {
    /*       display: "flex", */
  }
  {
    /*       alignItems: "flex-start", */
  }
  {
    /*       justifyContent: "flex-start", */
  }
  {
    /*       py: 3, */
  }
  {
    /*     }} */
  }
  {
    /*   > */
  }
  {
    /*     <Avatar */
  }
  {
    /*       variant="rounded" */
  }
  {
    /*       sx={{ */
  }
  {
    /*         width: 50, */
  }
  {
    /*         height: 50, */
  }
  {
    /*       }} */
  }
  {
    /*       alt="TEST USERNAME" */
  }
  {
    /*     /> */
  }
  {
    /*     <Box */
  }
  {
    /*       sx={{ */
  }
  {
    /*         display: "flex", */
  }
  {
    /*         alignItems: "flex-start", */
  }
  {
    /*         flexDirection: "column", */
  }
  {
    /*         justifyContent: "flex-start", */
  }
  {
    /*         ml: 2, */
  }
  {
    /*       }} */
  }
  {
    /*     > */
  }
  {
    /*       <CardWrapperSecondary>Test Message</CardWrapperSecondary> */
  }
  {
    /*       <Typography */
  }
  {
    /*         variant="subtitle1" */
  }
  {
    /*         sx={{ */
  }
  {
    /*           pt: 1, */
  }
  {
    /*           display: "flex", */
  }
  {
    /*           alignItems: "center", */
  }
  {
    /*         }} */
  }
  {
    /*       > */
  }
  {
    /*         <ScheduleTwoTone */
  }
  {
    /*           sx={{ */
  }
  {
    /*             mr: 0.5, */
  }
  {
    /*           }} */
  }
  {
    /*           fontSize="small" */
  }
  {
    /*         /> */
  }
  {
    /*         2 min ago */
  }
  {
    /*       </Typography> */
  }
  {
    /*     </Box> */
  }
  {
    /*   </Box> */
  }
  {
    /*   <Box */
  }
  {
    /*     display="flex" */
  }
  {
    /*     alignItems="flex-start" */
  }
  {
    /*     justifyContent="flex-end" */
  }
  {
    /*     py={3} */
  }
  {
    /*   > */
  }
  {
    /*     <Box */
  }
  {
    /*       display="flex" */
  }
  {
    /*       alignItems="flex-end" */
  }
  {
    /*       flexDirection="column" */
  }
  {
    /*       justifyContent="flex-end" */
  }
  {
    /*       mr={2} */
  }
  {
    /*     > */
  }
  {
    /*       <CardWrapperPrimary> */
  }
  {
    /*         Yes, I'll email them right now. I'll let you know once the remaining */
  }
  {
    /*         invoices are done. */
  }
  {
    /*       </CardWrapperPrimary> */
  }
  {
    /*       <Typography */
  }
  {
    /*         variant="subtitle1" */
  }
  {
    /*         sx={{ */
  }
  {
    /*           pt: 1, */
  }
  {
    /*           display: "flex", */
  }
  {
    /*           alignItems: "center", */
  }
  {
    /*         }} */
  }
  {
    /*       > */
  }
  {
    /*         <ScheduleTwoTone */
  }
  {
    /*           sx={{ */
  }
  {
    /*             mr: 0.5, */
  }
  {
    /*           }} */
  }
  {
    /*           fontSize="small" */
  }
  {
    /*         /> */
  }
  {
    /*         2 min ago */
  }
  {
    /*       </Typography> */
  }
  {
    /*     </Box> */
  }
  {
    /*     <Avatar */
  }
  {
    /*       variant="rounded" */
  }
  {
    /*       sx={{ */
  }
  {
    /*         width: 50, */
  }
  {
    /*         height: 50, */
  }
  {
    /*       }} */
  }
  {
    /*       alt="TEST USERNAME" */
  }
  {
    /*     /> */
  }
  {
    /*   </Box> */
  }
  {
    /*   <DividerWrapper>2 min ago</DividerWrapper> */
  }
  {
    /* </Box> */
  }
};
export default ChatMessage;
