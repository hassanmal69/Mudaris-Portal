import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// FETCH Chapters — with caching
export const fetchChapters = createAsyncThunk(
  "chapters/fetch",
  async (workspaceId, { getState }) => {
    const cache = getState().chapters.chaptersByWorkspace[workspaceId];
    if (cache) return cache;

    const { data, error } = await supabase
      .from("chapters_videos_presentations")
      .select("*")
      .eq("workspace_Id", workspaceId);

    if (error) throw error;
    return { workspaceId, data };
  }
);

// CREATE Chapter
export const createChapterDB = createAsyncThunk(
  "chapters/create",
  async (payload) => {
    const { data, error } = await supabase
      .from("chapters_videos_presentations")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

const chaptersSlice = createSlice({
  name: "chapters",
  initialState: {
    chaptersByWorkspace: {}, 
    loading: false,
  },
  reducers: {
    clearChapters: (state) => {
      state.chaptersByWorkspace = {};
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchChapters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        const { workspaceId, data } = action.payload;
        state.chaptersByWorkspace[workspaceId] = data;
        state.loading = false;
      })
      .addCase(fetchChapters.rejected, (state) => {
        state.loading = false;
      })

      // CREATE
      .addCase(createChapterDB.fulfilled, (state, action) => {
        const chapter = action.payload;
        const wid = chapter.workspace_Id;

        if (!state.chaptersByWorkspace[wid]) {
          state.chaptersByWorkspace[wid] = [];
        }

        state.chaptersByWorkspace[wid].unshift(chapter);
      });
  },
});

export const { clearChapters } = chaptersSlice.actions;
export default chaptersSlice.reducer;
