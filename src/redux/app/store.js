import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/auth/authSlice.js";
import signupFormReducer from "@/redux/features/auth/signupSlice";
import fileSliceReducer from "@/redux/features/ui/fileSlice";
import messageReducer from "@/redux/features/messages/messageSlice";
import searchReducer from "@/redux/features/messages/search/searchSlice.js";
import replyReducer from "@/redux/features/reply/replySlice.js";
import workspaceReducer from "@/redux/features/workspace/workspaceSlice.js";
import workspaceMembersReducer from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import channelsReducer from "@/redux/features/channels/channelsSlice.js";
import directSliceReducer from "@/redux/features/channels/directSlice.js";
import channelMembersReducer from "@/redux/features/channelMembers/channelMembersSlice.js";
import pinnedMessagesReducer from "@/redux/features/messages/pin/pinSlice.js";
import announcementsReducer from "@/redux/features/announcements/announcementsSlice.js";
import lectureLinkReducer from "../features/lecturesLink/lecturesLinksSlice.js";
import chapterReducer from "@/redux/features/video&presentations/chapterSlice";
import videosReducer from "@/redux/features/video&presentations/videoSlice";
import markCompleteSlice from "@/redux/features/video&presentations/markcompleteSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    signupForm: signupFormReducer,
    file: fileSliceReducer,
    reply: replyReducer,
    messages: messageReducer,
    search: searchReducer,
    workSpaces: workspaceReducer,
    workspaceMembers: workspaceMembersReducer,
    channels: channelsReducer,
    direct: directSliceReducer,
    channelMembers: channelMembersReducer,
    pinnedMessages: pinnedMessagesReducer,
    announcements: announcementsReducer,
    lectureLinks: lectureLinkReducer,
    chapters: chapterReducer,
    videos: videosReducer,
    markComplete: markCompleteSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
