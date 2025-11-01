import { useCallback, useRef } from 'react';
import { useChatStore, addMessageWithId } from '../store/chatStore';
import { useSessionStore } from '../store/sessionStore';
import { sendMessage } from '../api/chatApi';

export function useChatStream() {
  const conversationId = useSessionStore((s) => s.conversationId);
  const setLoading = useChatStore((s) => s.setLoading);
  const setError = useChatStore((s) => s.setError);
  const setSuggestions = useChatStore((s) => s.setSuggestions);
  const updateMessageById = useChatStore((s) => s.updateMessageById);
  const appendToMessageAnswer = useChatStore((s) => s.appendToMessageAnswer);
  const appendPlanToMessage = useChatStore((s) => s.appendPlanToMessage);

  const buffersRef = useRef<Map<string, string>>(new Map());
  const controllerRef = useRef<AbortController | null>(null);

  const send = useCallback(
    (question: string) => {
      if (controllerRef.current) {
        try {
          controllerRef.current.abort();
        } catch (_) {}
        controllerRef.current = null;
      }

      const userMsgId = addMessageWithId({ sender: 'user', question });
      setLoading(true);
      setError(null);

      if (!conversationId) {
        const politeMsg =
          'Sorry, the chat UI is not connected to the backend service at the moment. Please try again later.';
        const llmMsgId = addMessageWithId({ sender: 'llm', answer: '', isStreaming: true });
        buffersRef.current.set(llmMsgId, '');

        let i = 0;
        const stream = () => {
          i++;
          const partial = politeMsg.slice(0, i);
          buffersRef.current.set(llmMsgId, partial);
          updateMessageById(llmMsgId, { answer: partial, isStreaming: i < politeMsg.length });
          if (i < politeMsg.length) {
            setTimeout(stream, 15);
          } else {
            buffersRef.current.delete(llmMsgId);
            setLoading(false);
          }
        };
        stream();
        return;
      }

      const llmMsgId = addMessageWithId({ sender: 'llm', answer: '', isStreaming: true });
      buffersRef.current.set(llmMsgId, '');

      const controller = new AbortController();
      controllerRef.current = controller;

      sendMessage(
        conversationId,
        question,
        (data) => {
          if (controller.signal.aborted) return;

          if (data.error) {
            setError(data.error);
            updateMessageById(llmMsgId, { answer: data.error, isStreaming: false });
            buffersRef.current.delete(llmMsgId);
            setLoading(false);
            controllerRef.current = null;
            return;
          }

          const incoming = data.answer ?? '';
          const bufMap = buffersRef.current;
          const currentBuffer = bufMap.get(llmMsgId) ?? '';

          let newBuffer: string;
          if (!incoming) {
            newBuffer = currentBuffer;
          } else if (currentBuffer.length > 0 && incoming.startsWith(currentBuffer)) {
            newBuffer = incoming; // cumulative
          } else {
            const sep = currentBuffer && !currentBuffer.endsWith('\n') ? ' ' : '';
            newBuffer = currentBuffer + (sep + incoming); // delta append
          }

          bufMap.set(llmMsgId, newBuffer);

          // update accumulated answer
          updateMessageById(llmMsgId, { answer: newBuffer, isStreaming: !data.finalChunk });

          // append plan entry if provided and different from last appended
          if (data.plan) {
            appendPlanToMessage(llmMsgId, data.plan);
          }

          if (data.finalChunk) {
            updateMessageById(llmMsgId, { suggestions: data.suggestions, isStreaming: false });
            setSuggestions(data.suggestions || []);
            bufMap.delete(llmMsgId);
            setLoading(false);
            controllerRef.current = null;
          }
        },
        (err) => {
          if (controller.signal.aborted) {
            updateMessageById(llmMsgId, { isStreaming: false });
            buffersRef.current.delete(llmMsgId);
            setLoading(false);
            controllerRef.current = null;
            return;
          }
          setError(err?.message ?? 'Failed to get response');
          updateMessageById(llmMsgId, {
            answer:
              'Sorry, the chat UI is not connected to the backend service at the moment. Please try again later.',
            isStreaming: false,
          });
          buffersRef.current.delete(llmMsgId);
          setLoading(false);
          controllerRef.current = null;
        },
        controller.signal
      );
    },
    [conversationId, setLoading, setError, setSuggestions, updateMessageById, appendToMessageAnswer, appendPlanToMessage]
  );

  return {
    sendMessage: send,
  };
}