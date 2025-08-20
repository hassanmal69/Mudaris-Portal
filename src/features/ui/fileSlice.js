import { createSlice } from "@reduxjs/toolkit";
const fileSlice = createSlice({
    name: "fileSlice",
    initialState: {
        file: null,
        fileType: null
    },
    reducers: {
        setValue: (state, action) => {
            state.file = action.payload.file;
            state.fileType = action.payload.fileType;
        },
        clearValue: (state) => {
            state.file = null;
            state.fileType = null;
        }
    },
})
export const { setValue, clearValue } = fileSlice.actions;
export default fileSlice.reducer;