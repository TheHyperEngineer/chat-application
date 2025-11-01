import React from "react";
import { Box, Paper } from "@mui/material";
import SessionHeader from "./SessionHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import SuggestionBar from "./SuggestionBar";
import Loader from "./Loader";

const ChatWindow: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100vw"
      bgcolor="background.default"
      sx={{
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        width={{ xs: "100%", md: "60vw", lg: "60vw" }}
        maxWidth={"900px"}
        minWidth={{ xs: "100%", md: "400px" }}
        height={{ xs: "100vh", md: "90vh" }}
        margin="0 auto"
        boxShadow={3}
        borderRadius={3}
        bgcolor="background.paper"
        overflow="hidden"
      >
        <SessionHeader />
        <Box
          flex={1}
          p={2}
          display="flex"
          flexDirection="column"
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            height: 0,
            minHeight: 0,
            flex: 1,
          }}
        >
          <MessageList />
        </Box>
        <Box>
          <SuggestionBar />
          <Loader />
        </Box>
        <Box
          p={2}
          borderTop={1}
          borderColor="divider"
          bgcolor="background.default"
        >
          <MessageInput />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
