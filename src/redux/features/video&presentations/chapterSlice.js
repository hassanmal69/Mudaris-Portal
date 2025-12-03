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
      .eq("workspace_Id", workspaceId)
      .order("created_at", { ascending: true });

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

export const deleteChapterDB = createAsyncThunk(
  "chapter/deleteWithVideos",
  async (chapterId) => {
    const { data: videos, error: fetchErr } = await supabase
      .from("videos")
      .select("id")
      .eq("chapter_id", chapterId);

    if (fetchErr) throw fetchErr;
    if (videos.length > 0) {
      const videoIds = videos.map((v) => v.id);

      const { error: deleteVideosErr } = await supabase
        .from("videos")
        .delete()
        .in("id", videoIds);

      if (deleteVideosErr) throw deleteVideosErr;
    }

    const { error: deleteChapterErr } = await supabase
      .from("chapters_videos_presentations")
      .delete()
      .eq("id", chapterId);

    if (deleteChapterErr) throw deleteChapterErr;
    return chapterId;
  }
);
export const updateChapterDB = createAsyncThunk(
  "chapters/update",
  async ({ id, payload }) => {
    const { data, error } = await supabase
      .from("chapters_videos_presentations")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data; // updated chapter
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
      })
      .addCase(deleteChapterDB.fulfilled, (state, action) => {
        const deletedId = action.payload;
        console.log("deleted id hehe", action, deletedId);
        Object.keys(state.chaptersByWorkspace).forEach((wid) => {
          state.chaptersByWorkspace[wid] = state.chaptersByWorkspace[
            wid
          ].filter((chapter) => chapter.id !== deletedId);
        });
      })
      .addCase(updateChapterDB.fulfilled, (state, action) => {
        const updated = action.payload;
        const wid = updated.workspace_Id;

        if (!state.chaptersByWorkspace[wid]) return;

        state.chaptersByWorkspace[wid] = state.chaptersByWorkspace[wid].map(
          (chapter) =>
            chapter.id === updated.id ? { ...chapter, ...updated } : chapter
        );
      });
  },
});

export const { clearChapters } = chaptersSlice.actions;
export default chaptersSlice.reducer;
