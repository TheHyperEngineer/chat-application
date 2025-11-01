import { useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { startSession } from '../api/chatApi';

export function useSession(userId: string) {
  const conversationId = useSessionStore((state) => state.conversationId);
  const setConversationId = useSessionStore((state) => state.setConversationId);
  const setUserId = useSessionStore((state) => state.setUserId);

  useEffect(() => {
    if (!conversationId && userId) {
      startSession(userId)
        .then((id) => {
          if (id) setConversationId(id);
        })
        .catch(() => {});
      setUserId(userId);
    }
  }, [conversationId, userId, setConversationId, setUserId]);

  return { conversationId };
}
