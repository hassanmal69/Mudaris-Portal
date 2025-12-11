// unreadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const unreadSlice = createSlice({
    name: 'unread',
    initialState: {
        messages: {}, // FIXED: Changed from unReadmessages to messages
    },
    reducers: {
        setUnreadCount: (state, action) => {
            const { channelId, count } = action.payload;
            state.messages[channelId] = count;
        },
        // 🔥 ADD THIS: Batch update action
        setAllUnreadCounts: (state, action) => {
            console.warn('in redux coming unread',action.payload)
            state.messages = action.payload;
        },
        updateUnreadCount: (state, action) => {
            const { channelId, increment = 1 } = action.payload;
            state.messages[channelId] = (state.messages[channelId] || 0) + increment;
        },
        resetUnreadCount: (state, action) => {
            const { channelId } = action.payload;
            state.messages[channelId] = 0;
        },
    },
});

// Export actions
export const { setUnreadCount, setAllUnreadCounts, updateUnreadCount, resetUnreadCount } = unreadSlice.actions;

// Export selector
export const selectUnreadMessages = (state) => state.unread?.messages || {};

export default unreadSlice.reducer;