import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSessionStore } from '../store/sessionStore';
import { sendMessage } from '../api/chatApi';

export function useChatStream() {
  const conversationId = useSessionStore((state) => state.conversationId);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const setLoading = useChatStore((state) => state.setLoading);
  const setError = useChatStore((state) => state.setError);
  const setSuggestions = useChatStore((state) => state.setSuggestions);

  const send = useCallback(
    (question: string) => {
      const userMsgId = Date.now().toString();
  addMessage({ id: userMsgId, sender: 'user', question });
      setLoading(true);
      setError(null);
      if (!conversationId) {
        // No session, stream polite LLM response character by character
        const politeMsg = 'Sorry, the chat UI is not connected to the backend service at the moment. Please try again later.';
        const llmMsgId = (Date.now() + 1).toString();
  addMessage({ id: llmMsgId, sender: 'llm', answer: '', isStreaming: true });
        let i = 0;
        const stream = () => {
          i++;
          updateLastMessage({ answer: politeMsg.slice(0, i) });
          if (i < politeMsg.length) {
            setTimeout(stream, 15); // stream speed
          } else {
            updateLastMessage({ isStreaming: false });
            setLoading(false);
          }
        };
        stream();
        return;
      }
      const llmMsgId = (Date.now() + 1).toString();
  addMessage({ id: llmMsgId, sender: 'llm', answer: '', isStreaming: true });
      sendMessage(
        conversationId,
        question,
        (data) => {
          if (data.error) {
            setError(data.error);
            updateLastMessage({
              answer: data.error,
              isStreaming: false,
            });
            setLoading(false);
            return;
          }
          updateLastMessage({
            answer: data.answer,
            plan: data.plan,
            suggestions: data.suggestions,
            isStreaming: false,
          });
          setSuggestions(data.suggestions || []);
        },
        () => {
          setError('Failed to get response');
          updateLastMessage({
            answer: 'Sorry, the chat UI is not connected to the backend service at the moment. Please try again later.',
            isStreaming: false,
          });
          setLoading(false);
        }
      );
    },
    [conversationId, addMessage, updateLastMessage, setLoading, setError, setSuggestions]
  );

  return {
    sendMessage: send,
  };
}
