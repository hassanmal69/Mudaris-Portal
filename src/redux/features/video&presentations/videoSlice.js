import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// FETCH videos by chapter
export const fetchVideos = createAsyncThunk(
  "videos/fetch",
  async (chapter_id) => {
    console.log('hhhh',chapter_id)
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("chapter_id", chapter_id)

    if (error) throw error;
    console.log(data)
    return data;
  }
);

// CREATE video
export const createVideoDB = createAsyncThunk(
  "videos/create",
  async (payload) => {
    console.log('description is',payload)
    const { data, error } = await supabase
      .from("videos")
      .insert(payload)
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
export const deleteVideoDB = createAsyncThunk(
  "videos/delete",
  async (id) => {
    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return id;
  }
);

const videosSlice = createSlice({
  name: "videos",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    clearVideos: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchVideos.rejected, (state) => {
        state.loading = false;
      })

      // CREATE
      .addCase(createVideoDB.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateVideoDB.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((v) =>
          v.id === updated.id ? updated : v
        );
      })

      // DELETE
      .addCase(deleteVideoDB.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export const { clearVideos } = videosSlice.actions;
export default videosSlice.reducer;
