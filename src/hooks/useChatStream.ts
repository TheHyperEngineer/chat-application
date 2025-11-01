import { useCallback, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useSessionStore } from '../store/sessionStore';
import { sendMessage as apiSendMessage } from '../api/chatApi';

export function useChatStream() {
  const conversationId = useSessionStore((s) => s.conversationId);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessageById = useChatStore((s) => s.updateMessageById);
  const appendToMessageAnswer = useChatStore((s) => s.appendToMessageAnswer);
  const setLoading = useChatStore((s) => s.setLoading);
  const setError = useChatStore((s) => s.setError);
  const setSuggestions = useChatStore((s) => s.setSuggestions);

  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    (question: string) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      addMessage({ sender: 'user', question });
      setLoading(true);
      setError(null);
      setSuggestions([]);

      if (!conversationId) {
        setError('No active session. Please refresh the page.');
        setLoading(false);
        return;
      }

      const llmMsgId = addMessage({ sender: 'llm', answer: '', isStreaming: true });
      const controller = new AbortController();
      controllerRef.current = controller;

      apiSendMessage(
        conversationId,
        question,
        (data) => {
          if (controller.signal.aborted) return;

          // This is an intermediate, answer-only chunk
          if (data.answer) {
            appendToMessageAnswer(llmMsgId, data.answer);
          }

          // This is the final, structured chunk
          if (data.finalChunk) {
            updateMessageById(llmMsgId, {
              plan: data.plan,
              suggestions: data.suggestions,
              isStreaming: false,
            });
            setSuggestions(data.suggestions || []);
            setLoading(false);
            controllerRef.current = null;
          }
        },
        (err) => {
          if (controller.signal.aborted) return;
          setError(err.message);
          updateMessageById(llmMsgId, {
            answer: `An error occurred: ${err.message}`,
            isStreaming: false,
          });
          setLoading(false);
          controllerRef.current = null;
        },
        controller.signal
      );
    },
    [
      conversationId,
      addMessage,
      updateMessageById,
      appendToMessageAnswer,
      setLoading,
      setError,
      setSuggestions,
    ]
  );

  return { sendMessage };
}