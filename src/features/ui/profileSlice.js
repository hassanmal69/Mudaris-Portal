import { createSlice } from "@reduxjs/toolkit";
const profileSlice = createSlice({
    name: "profileEdit",
    initialState: {
        editProfileOpen: false,
    },
    reducers: {
        updateValue: (state) => {
            state.editProfileOpen = !state.editProfileOpen;
        },
        setValue: (state, action) => {
            state.editProfileOpen = action.payload;
        },
    },
})
export default profileSlice.reducer
export const { updateValue, setValue } = profileSlice.actions