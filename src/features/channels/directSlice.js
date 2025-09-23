import { createSlice } from "@reduxjs/toolkit";

const directSlice = createSlice({
    name: "directChannel",
    initialState: {
        directChannel: '',
    },
    reducers: {
        newDirect: (state, action) => {
            const channel = action.payload
            state.directChannel = channel
            console.log('new value is updated in redux', state.directChannel);
        },
        setValue: (state, action) => {
            state.directChannel = action.payload;
        },
    }
});
export default directSlice.reducer
export const { newDirect, setValue, directChannel } = directSlice.actions