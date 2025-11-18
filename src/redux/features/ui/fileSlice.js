import { createSlice } from "@reduxjs/toolkit";
const fileSlice = createSlice({
    name: "fileSlice",
    initialState: {
        files: []
    },
    reducers: {
        addValue: (state, action) => {
            // state.file = action.payload.file;
            // state.fileLink = action.payload.fileLink;
            // state.fileType = action.payload.fileType;
            state.files.push(action.payload)
        },
        removeValue: (state, action) => {
            state.files = state.files.filter((m, i) => i !== action.payload)
        },
        clearValue: (state) => {
            state.files = []
        }
    },
})
export const { addValue, removeValue, clearValue } = fileSlice.actions;
export default fileSlice.reducer;