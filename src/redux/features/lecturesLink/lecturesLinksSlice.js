import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// READ (pagination)
export const fetchLecturesLink = createAsyncThunk(
  "fetchLecturesLink/fetch",
  async ({ from, to, workspace_id }) => {
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("workspace_id", workspace_id)
      .order("lecture_date", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }
);

// CREATE
export const createLecturesLink = createAsyncThunk(
  "createLecturesLink/create",
  async (payload) => {
    const { data, error } = await supabase
      .from("lectures")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

// UPDATE
export const updateLecturesLink = createAsyncThunk(
  "updateLecturesLink/update",
  async ({ id, updates }) => {
    const { data, error } = await supabase
      .from("lectures")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }
);

// DELETE
export const deleteLecturesLink = createAsyncThunk(
  "deleteLecturesLink/delete",
  async (id) => {
    const { error } = await supabase.from("lectures").delete().eq("id", id);

    if (error) throw error;
    return id;
  }
);

//slice
const lecturesLink = createSlice({
  name: "lecturesLink",
  initialState: {
    list: [],
    loading: false,
  },

  reducers: {
    clearLecturesLink: (state) => {
      state.list = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // READ

      .addCase(fetchLecturesLink.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLecturesLink.fulfilled, (state, action) => {
        const existingIds = new Set(state.list.map((l) => l.id));
        const filtered = action.payload.filter((l) => !existingIds.has(l.id));

        state.list.push(...filtered);
        state.loading = false;
      })

      .addCase(fetchLecturesLink.rejected, (state) => {
        state.loading = false;
      })

      //CREATE
      .addCase(createLecturesLink.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      // UPDATE
      .addCase(updateLecturesLink.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((a) => (a.id === updated.id ? updated : a));
      })

      // DELETE
      .addCase(deleteLecturesLink.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearLecturesLink } = lecturesLink.actions;
export default lecturesLink.reducer;
