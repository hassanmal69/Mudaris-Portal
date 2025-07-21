import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice.js";
import signupFormReducer from "@/features/auth/signupSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    signupForm: signupFormReducer,
  },
});
