import React from "react";
import { Box, Chip } from "@mui/material";
import { useChatStore } from "../store/chatStore";

const SuggestionBar: React.FC = () => {
  const suggestions = useChatStore((state) => state.suggestions);
  const loading = useChatStore((state) => state.loading);
  const addMessage = useChatStore((state) => state.addMessage); // Placeholder, will be replaced by hook

  if (!suggestions.length || loading) return null;

  return (
    <Box display="flex" flexWrap="wrap" gap={1} p={2}>
      {suggestions.map((s, idx) => (
        <Chip
          key={idx}
          label={s}
          color="secondary"
          onClick={() =>
            addMessage({
              id: Date.now().toString(),
              sender: "user",
              question: s,
            })
          }
          sx={{ cursor: "pointer" }}
        />
      ))}
    </Box>
  );
};

export default SuggestionBar;
