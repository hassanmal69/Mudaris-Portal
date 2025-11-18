import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// READ (pagination)
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetch",
  async ({ from, to }) => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }
);

// CREATE
export const createAnnouncementDB = createAsyncThunk(
  "announcements/create",
  async (payload) => {
    const { data, error } = await supabase
      .from("announcements")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

// UPDATE
export const updateAnnouncementDB = createAsyncThunk(
  "announcements/update",
  async ({ id, updates }) => {
    const { data, error } = await supabase
      .from("announcements")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

// DELETE
export const deleteAnnouncementDB = createAsyncThunk(
  "announcements/delete",
  async (id) => {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return id;
  }
);

const announcementsSlice = createSlice({
  name: "announcements",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    clearAnnouncements: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // READ
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.list = [...state.list, ...action.payload];
        state.loading = false;
      })
      .addCase(fetchAnnouncements.rejected, (state) => {
        state.loading = false;
      })

      // CREATE
      .addCase(createAnnouncementDB.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateAnnouncementDB.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((a) => (a.id === updated.id ? updated : a));
      })

      // DELETE
      .addCase(deleteAnnouncementDB.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAnnouncements } = announcementsSlice.actions;
export default announcementsSlice.reducer;
