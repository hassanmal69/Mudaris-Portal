import { createSlice } from "@reduxjs/toolkit";
const fileSlice = createSlice({
    name: "fileSlice",
    initialState: {
        files: []
    },
    reducers: {
        addValue: (state, action) => {
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