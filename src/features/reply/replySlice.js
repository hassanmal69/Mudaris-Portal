import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: null,
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    openReplyDrawer: (state, action) => {
      state.open = true;
      state.message = action.payload;
    },
    closeReplyDrawer: (state) => {
      state.open = false;
      state.message = null;
    },
  },
});

export const { openReplyDrawer, closeReplyDrawer } = replySlice.actions;
export default replySlice.reducer;