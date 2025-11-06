import { createSlice } from "@reduxjs/toolkit";

const directSlice = createSlice({
  name: "directChannel",
  initialState: {
    directChannel: "",
    loading: false,
    error: null,
  },
  reducers: {
    newDirect: (state, action) => {
      state.directChannel = action.payload;
    },
    setValue: (state, action) => {
      state.directChannel = action.payload;
    },
  }
});

export const { newDirect, setValue } = directSlice.actions;
export default directSlice.reducer;
