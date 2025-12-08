import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// FETCH videos by chapter — with caching
export const fetchVideos = createAsyncThunk(
  "videos/fetch",
  async (chapter_id, { getState }) => {
    const cache = getState().videos.videosByChapter[chapter_id];
    if (cache) return cache;
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("chapter_id", chapter_id);

    if (error) throw error;

    return { chapter_id, data };
  }
);

// CREATE video
export const createVideoDB = createAsyncThunk(
  "videos/create",
  async (payload) => {
    const { name, description, video_link, chapter_id, presentation_file } =
      payload;

    let presentation_link = null;

    // Upload PPT if provided
    if (presentation_file) {
      const fileExt = presentation_file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `presentionPpt/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, presentation_file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      presentation_link = urlData.publicUrl;
    }

    // Insert video record
    const { data, error } = await supabase
      .from("videos")
      .insert({
        name,
        description,
        video_link,
        chapter_id,
        presentation_link,
      })
      .select("*")
      .single();

    if (error) throw error;

    return data;
  }
);

// UPDATE video
export const updateVideoDB = createAsyncThunk(
  "videos/update",
  async ({ id, updates }) => {
    console.log('here id an upate',id,updates);
    const { data, error } = await supabase
      .from("videos")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

// DELETE video
export const deleteVideoDB = createAsyncThunk("videos/delete", async (id) => {
  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) throw error;
  return id;
});

const videosSlice = createSlice({
  name: "videos",
  initialState: {
    videosByChapter: {}, // 💡 chapter-level caching
    loading: false,
  },
  reducers: {
    clearVideos: (state) => {
      state.videosByChapter = {};
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        const { chapter_id, data } = action.payload?.chapter_id
          ? action.payload
          : { chapter_id: null, data: action.payload };

        if (chapter_id) {
          state.videosByChapter[chapter_id] = data;
        }
        state.loading = false;
      })
      .addCase(fetchVideos.rejected, (state) => {
        state.loading = false;
      })

      // CREATE
      .addCase(createVideoDB.fulfilled, (state, action) => {
        const video = action.payload;
        const cid = video.chapter_id;

        if (!state.videosByChapter[cid]) {
          state.videosByChapter[cid] = [];
        }

        state.videosByChapter[cid].push(video);
      })

      // UPDATE
      .addCase(updateVideoDB.fulfilled, (state, action) => {
        const updated = action.payload;
        const cid = updated.chapter_id;

        state.videosByChapter[cid] = state.videosByChapter[cid].map((v) =>
          v.id === updated.id ? updated : v
        );
      })

      // DELETE
      .addCase(deleteVideoDB.fulfilled, (state, action) => {
        const deletedId = action.payload;

        for (const cid in state.videosByChapter) {
          state.videosByChapter[cid] = state.videosByChapter[cid].filter(
            (v) => v.id !== deletedId
          );
        }
      });
  },
});

export const { clearVideos } = videosSlice.actions;
export default videosSlice.reducer;
