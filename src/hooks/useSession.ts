
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
        .then((session) => {
          if (session && session.conversationId) setConversationId(session.conversationId);
        })
        .catch(() => {
          // Optionally handle session error (show error in UI)
        });
      setUserId(userId);
    }
    // Optionally, handle session cleanup on unmount
    // return () => { if (conversationId) endSession(conversationId); };
  }, [conversationId, userId, setConversationId, setUserId]);

  return { conversationId };
}
