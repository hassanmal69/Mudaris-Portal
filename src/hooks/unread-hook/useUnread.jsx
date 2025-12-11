import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useMessages from '@/hooks/messages-hook/useMessages';
import { setAllUnreadCounts } from '@/redux/features/unread/unreadSlice';
import { useParams } from 'react-router-dom';

const UnreadProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useMessages();

  const lastSeen = useSelector((state) => state.lastSeen.data); 
  const lastSeenLoaded = useSelector((state) => state.lastSeen.loaded);

  const { workspace_id } = useParams();

  useEffect(() => {
    if (!workspace_id) return;
    if (loading) return;
    if (lastSeenLoaded) return;     
    if (!messages || !Array.isArray(messages)) return;

    const counts = {};

    messages.forEach((message) => {
      const channelId = message.channel_id;
      const lastSeenTime = lastSeen[channelId];

      const isUnread =
        !lastSeenTime ||
        new Date(message.created_at) > new Date(lastSeenTime);

      if (isUnread) {
        counts[channelId] = (counts[channelId] || 0) + 1;
      }
    });

    dispatch(setAllUnreadCounts(counts));
  }, [messages, loading, lastSeen, lastSeenLoaded, workspace_id, dispatch]);

  return children;
};

export default UnreadProvider;
