import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice.js";
import signupFormReducer from "@/features/auth/signupSlice";
import profileEditReducer from "@/features/ui/profileSlice";
import fileSliceReducer from "@/features/ui/fileSlice";
import messageReducer from "@/features/messages/messageSlice";
import searchReducer from "@/features/messages/search/searchSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    signupForm: signupFormReducer,
    profile: profileEditReducer,
    file: fileSliceReducer,
    messages: messageReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
