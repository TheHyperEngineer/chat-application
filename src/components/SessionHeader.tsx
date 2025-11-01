import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useSessionStore } from "../store/sessionStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const SessionHeader: React.FC = () => {
  const conversationId = useSessionStore((state) => state.conversationId);
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box mr={2}>
          <FontAwesomeIcon icon={faComments} />
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Chat with LLM
        </Typography>
        {conversationId && (
          <Typography variant="caption" color="inherit">
            Session: {conversationId}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SessionHeader;
