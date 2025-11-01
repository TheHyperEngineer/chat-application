import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useChatStream } from "../hooks/useChatStream";

const MessageInput: React.FC = () => {
  const [input, setInput] = useState("");
  const { sendMessage } = useChatStream();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <Box display="flex" alignItems="center" p={2}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") handleSend();
        }}
        aria-label="Type your message"
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!input.trim()}
        aria-label="Send"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
