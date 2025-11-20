import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// CREATE Chapter
export const createChapterDB = createAsyncThunk(
    "chapters/create",
    async (payload) => {
        const { data, error } = await supabase
            .from("chapters_videos_presentations")
            .insert(payload)
            .single();
        if (error) throw error;
        return data;
    }
);

// READ Chapters (optional)
export const fetchChapters = createAsyncThunk("chapters/fetch", async (payload) => {
    const { data, error } = await supabase.from("chapters_videos_presentations")
        .select("*")
        .eq('workspace_Id', payload)
    if (error) throw error;
    return data;
});

const chaptersSlice = createSlice({
    name: "chapters",
    initialState: {
        list: [],
        loading: false,
    },
    reducers: {
        clearChapters: (state) => {
            state.list = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createChapterDB.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            // READ
            .addCase(fetchChapters.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChapters.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchChapters.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { clearChapters } = chaptersSlice.actions;
export default chaptersSlice.reducer;
