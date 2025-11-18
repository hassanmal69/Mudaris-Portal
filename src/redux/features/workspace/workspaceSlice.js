import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// create workspace
export const createWorkspace = createAsyncThunk(
  "workspaces/create",
  async ({ name, description, avatarFile, adminId }, { rejectWithValue }) => {
    try {
      let avatarUrl = null;

      // 1. Upload avatar if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const newFilePath = `workspaces/${adminId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(newFilePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(newFilePath);

        avatarUrl = publicUrl;
      }
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.log('error caling session', error);
      }
      // 2. Call the Edge Function
      const res = await fetch(
        `https://surdziukuzjqthcfqoax.supabase.co/functions/v1/createWorkspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name, description, avatarUrl, adminId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create workspace");
      return data.workspace;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch all workspaces
export const fetchAllWorkspaces = createAsyncThunk(
  "workspaces/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, workspace_name, avatar_url, description");

      if (error) throw error;
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// fetch single workspace by ID
export const fetchWorkspaceById = createAsyncThunk(
  "workspaces/fetchById",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, workspace_name, description, avatar_url")
        .eq("id", workspaceId)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState: {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
  },
  reducers: {
    addWorkspacesRealtime: (state, action) => {
      const newWorkspace = action.payload;
      const exists = state.workspaces.find((w) => w.id === newWorkspace.id);
      if (exists) {
        state.workspaces = state.workspaces.map((w) =>
          w.id === newWorkspace.id ? newWorkspace : w
        );
      } else {
        state.workspaces.push(newWorkspace);
      }
    },

    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload || [];
      })
      .addCase(fetchAllWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addWorkspacesRealtime, setCurrentWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
