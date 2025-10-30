import { createSlice } from "@reduxjs/toolkit";
const messageSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.items = action.payload;
    },
    addMessage: (state, action) => {
      state.items.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    clearMessages: (state) => {
      state.items = [];
    },
  },
});
export const { setMessages, addMessage, removeMessage, clearMessages } =
  messageSlice.actions;
export default messageSlice.reducer;
