import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice.js";
import signupFormReducer from "@/features/auth/signupSlice";
import profileEditReducer from "@/features/ui/profileSlice";
import fileSliceReducer from '@/features/ui/fileSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    signupForm: signupFormReducer,
    profile: profileEditReducer,
    file: fileSliceReducer
  },
});
