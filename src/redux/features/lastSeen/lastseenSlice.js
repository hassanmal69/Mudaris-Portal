import { createSlice } from "@reduxjs/toolkit";
// import { supabase } from "@/services/supabaseClient";
const lastSeen = createSlice({
    name: "lastSeen",
    initialState: {
        lastSeen: {},
        loading: false,
        error: null
    },
    reducers: {
        setLastSeen: (state, action) => {
            const { groupId, timestamp } = action.payload
            state.lastSeen[groupId] = timestamp
        }
    }
})
export const { setLastSeen } = lastSeen.actions;
export default lastSeen.reducer;
