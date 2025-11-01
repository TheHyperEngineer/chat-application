import React from 'react';
import { Box, Chip } from '@mui/material';
import { useChatStore } from '../store/chatStore';
import { useChatStream } from '../hooks/useChatStream'; // ADDED

const SuggestionBar: React.FC = () => {
  const suggestions = useChatStore((state) => state.suggestions);
  const loading = useChatStore((state) => state.loading);
  const { sendMessage } = useChatStream(); // ADDED

  if (!suggestions.length || loading) return null;

  return (
    <Box display="flex" flexWrap="wrap" gap={1} p={2} justifyContent="flex-end">
      {suggestions.map((s, idx) => (
        <Chip
          key={idx}
          label={s}
          variant="outlined"
          color="primary"
          // CHANGED: onClick now sends the suggestion as a new message
          onClick={() => sendMessage(s)}
          sx={{ cursor: 'pointer' }}
        />
      ))}
    </Box>
  );
};

export default SuggestionBar;