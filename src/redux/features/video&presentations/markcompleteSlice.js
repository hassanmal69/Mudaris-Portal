import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

export const fetchMarkasComplete = createAsyncThunk(
    "fetchMarkasComplete/fetch",
    async (userId) => {
        const { data, error } = await supabase.from('user_video_progress')
            .select('*')
            .eq('user_id', userId)
        if (error) throw error
        return data.map((row) => row.video_id)
    }
)
export const markVideoComplete = createAsyncThunk(
    "videoProgress/markComplete",
    async ({ userId, videoId }) => {
        const { error } = await supabase
            .from("user_video_progress")
            .insert({ user_id: userId, video_id: videoId })
        if (error) console.log(error);
        return videoId;
    }
);
const markCompleteSlice = createSlice({
    name: "markCompleteSlice",
    initialState: {
        completedVideos: []
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMarkasComplete.fulfilled, (state, action) => {
            state.completedVideos = action.payload
        })
            .addCase(markVideoComplete.fulfilled, (state, action) => {
                state.completedVideos.push(action.payload)
            })
    }
})
export default markCompleteSlice.reducer;
