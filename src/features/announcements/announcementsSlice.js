import { createSlice } from "@reduxjs/toolkit";

const announcementsSlice = createSlice({
  name: "announcements",
  initialState: [],
  reducers: {
    createAnnouncement: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { createAnnouncement } = announcementsSlice.actions;
export default announcementsSlice.reducer;
