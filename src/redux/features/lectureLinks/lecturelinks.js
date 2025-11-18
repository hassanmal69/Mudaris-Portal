import { createSlice } from "@reduxjs/toolkit";

const lectureLinksSlice = createSlice({
  name: "lectureLinks",
  initialState: [],
  reducers: {
    createLectureLink: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { createLectureLink } = lectureLinksSlice.actions;
export default lectureLinksSlice.reducer;
