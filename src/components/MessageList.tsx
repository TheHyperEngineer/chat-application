import React from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import { useChatStore } from "../store/chatStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRobot } from "@fortawesome/free-solid-svg-icons";

const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);
  return (
    <List>
      {messages.map((msg) => {
        const isUser = msg.sender === "user";
        return (
          <ListItem
            key={msg.id}
            alignItems="flex-start"
            sx={{
              justifyContent: isUser ? "flex-start" : "flex-end",
              textAlign: isUser ? "left" : "right",
            }}
          >
            {isUser && (
              <Box mr={2} mt={0.5}>
                <FontAwesomeIcon icon={faUser} />
              </Box>
            )}
            <Box
              sx={{
                bgcolor: isUser ? "grey.100" : "primary.light",
                color: isUser ? "text.primary" : "primary.contrastText",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                ml: isUser ? 0 : "auto",
                mr: isUser ? "auto" : 0,
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">
                {isUser ? msg.question : msg.answer}
              </Typography>
              {msg.plan && msg.sender === "llm" && (
                <Typography variant="caption" color="text.secondary">
                  Plan: {msg.plan}
                </Typography>
              )}
            </Box>
            {!isUser && (
              <Box ml={2} mt={0.5}>
                <FontAwesomeIcon icon={faRobot} />
              </Box>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;
