import React from 'react';
import { List, ListItem, Typography, Box, Paper } from '@mui/material';
import { useChatStore } from '../store/chatStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <List sx={{ paddingX: 2 }}>
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <ListItem
            key={msg.id}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: isUser ? 'flex-start' : 'flex-end',
              paddingX: 0,
            }}
          >
            {isUser && (
              <Box mt={0.5} mr={1.5}>
                <FontAwesomeIcon icon={faUser} size="lg" />
              </Box>
            )}
            <Paper
              elevation={2}
              sx={{
                bgcolor: isUser ? 'background.default' : 'primary.main',
                color: isUser ? 'text.primary' : 'primary.contrastText',
                px: 2,
                py: 1,
                borderRadius: 3,
                borderTopLeftRadius: isUser ? 0 : 3,
                borderTopRightRadius: isUser ? 3 : 0,
                maxWidth: '80%',
              }}
            >
              {/* RENDER PLAN SEPARATELY */}
              {msg.sender === 'llm' && msg.plan && msg.plan.length > 0 && (
                <Box
                  component="div"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    pb: 1,
                    mb: 1,
                    opacity: 0.8,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Plan:
                  </Typography>
                  <List sx={{ padding: 0, margin: 0 }}>
                    {msg.plan.map((step, index) => (
                      <ListItem key={index} sx={{ padding: '0 0 0 16px', margin: 0 }}>
                        <Typography variant="caption" component="div">
                          {index + 1}. {step}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* RENDER ANSWER WITH MARKDOWN */}
              <Typography component="div" variant="body1">
                {isUser ? (
                  msg.question
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.answer}
                  </ReactMarkdown>
                )}
              </Typography>
            </Paper>
            {!isUser && (
              <Box mt={0.5} ml={1.5}>
                <FontAwesomeIcon icon={faRobot} size="lg" />
              </Box>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;