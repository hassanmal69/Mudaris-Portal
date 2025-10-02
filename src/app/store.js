import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice.js";
import signupFormReducer from "@/features/auth/signupSlice";
import fileSliceReducer from "@/features/ui/fileSlice";
import messageReducer from "@/features/messages/messageSlice";
import searchReducer from "@/features/messages/search/searchSlice.js";
import replyReducer from "@/features/reply/replySlice.js";
import workspaceReducer from "@/features/workspace/workspaceSlice.js";
import workspaceMembersReducer from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import channelsReducer from "@/features/channels/channelsSlice.js";
import directSliceReducer from '@/features/channels/directSlice.js'
import channelMembersReducer from "@/features/channelMembers/channelMembersSlice.js";
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
    channelMembers: channelMembersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
