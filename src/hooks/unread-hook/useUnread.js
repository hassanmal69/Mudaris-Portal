import { useMemo, useCallback } from 'react';
import useMessages from '../messages-hook/useMessages';
import { useSelector } from 'react-redux';

const useUnread = () => {
    const { messages } = useMessages();
    const lastSeen = useSelector((state) => state.lastSeen || {});

    // Calculate unread counts for each channel
    const channelUnreadCounts = useMemo(() => {
        const counts = {};

        if (!messages || !Array.isArray(messages)) return counts;

        messages.forEach(message => {
            const channelId = message.channel_id;
            const lastSeenTime = lastSeen[channelId];

            // If no last seen time or message is newer
            if (!lastSeenTime || new Date(message.created_at) > new Date(lastSeenTime)) {
                counts[channelId] = (counts[channelId] || 0) + 1;
            }
        });

        return counts;
    }, [messages, lastSeen]);

    // Get unread count for a specific channel
    const getUnread = useCallback((channelId) => {
        if (!channelId) return 0;
        return channelUnreadCounts[channelId] || 0;
    }, [channelUnreadCounts]);

    // Check if a specific message is unread
    const isMessageUnread = useCallback((message) => {
        if (!message || !message.channel_id || !message.created_at) return false;
        
        const lastSeenTime = lastSeen[message.channel_id];
        if (!lastSeenTime) return true; // No last seen = all messages are unread
        
        return new Date(message.created_at) > new Date(lastSeenTime);
    }, [lastSeen]);

    // Get unread messages for a specific channel
    const getUnreadMessages = useCallback((channelId) => {
        if (!messages || !Array.isArray(messages) || !channelId) return [];
        
        const lastSeenTime = lastSeen[channelId];
        
        return messages.filter(message => {
            if (message.channel_id !== channelId) return false;
            if (!lastSeenTime) return true; // No last seen = all are unread
            return new Date(message.created_at) > new Date(lastSeenTime);
        });
    }, [messages, lastSeen]);

    // Get total unread across all channels
    const totalUnread = useMemo(() => {
        return Object.values(channelUnreadCounts).reduce((sum, count) => sum + count, 0);
    }, [channelUnreadCounts]);

    // Get channels with unread messages
    const channelsWithUnread = useMemo(() => {
        return Object.keys(channelUnreadCounts).filter(channelId => 
            channelUnreadCounts[channelId] > 0
        );
    }, [channelUnreadCounts]);

    // Check if any channel has unread messages
    const hasUnread = useMemo(() => {
        return Object.keys(channelUnreadCounts).some(channelId => 
            channelUnreadCounts[channelId] > 0
        );
    }, [channelUnreadCounts]);

    return {
        // Raw counts object
        counts: channelUnreadCounts,
        
        // Helper functions
        getUnread,                    // (channelId) => number
        isMessageUnread,              // (message) => boolean
        getUnreadMessages,            // (channelId) => Message[]
        
        // Aggregated data
        totalUnread,                  // number
        channelsWithUnread,           // string[] (channel IDs)
        hasUnread,                    // boolean
        
        // Alias for backward compatibility
        unreadCounts: channelUnreadCounts,
        
        // Metadata
        lastSeenTimestamps: lastSeen, // Access to raw lastSeen data
        totalMessages: messages?.length || 0
    };
};

export default useUnread;