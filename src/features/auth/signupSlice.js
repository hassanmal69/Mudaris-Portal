import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  email: "",
  password: "",
  avatarUrl: "",
};

const signupFormSlice = createSlice({
  name: "signupForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetSignupForm: () => initialState,
  },
});

export const { updateField, resetSignupForm } = signupFormSlice.actions;
export default signupFormSlice.reducer;
