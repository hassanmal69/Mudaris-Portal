import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// Async thunk to fetch workspace members with caching
export const fetchWorkspaceMembers = createAsyncThunk(
  "workspaceMembers/fetchWorkspaceMembers",
  async (workspaceId, { getState, rejectWithValue }) => {
    const state = getState().workspaceMembers;
    // Caching: Don't fetch if already present
    if (state.byWorkspaceId[workspaceId]?.members?.length > 0) {
      return {
        workspaceId,
        members: state.byWorkspaceId[workspaceId].members,
        cached: true,
      };
    }
    const { data, error } = await supabase
      .from("workspace_members")
      .select("user_id, profiles(full_name, avatar_url)")
      .eq("workspace_id", workspaceId);

    if (error) {
      return rejectWithValue({ workspaceId, error: error.message });
    }
    return { workspaceId, members: data, cached: false };
  }
);

// Async thunk to add a member to a workspace
export const addWorkspaceMember = createAsyncThunk(
  "workspaceMembers/addWorkspaceMember",
  async ({ userId, workspaceId, role }, { rejectWithValue }) => {
    const { error } = await supabase
      .from("workspace_members")
      .insert([{ user_id: userId, workspace_id: workspaceId, role }]);
    if (error) return rejectWithValue(error.message);
    return { userId, workspaceId, role };
  }
);

// Async thunk to fetch user's workspace
export const fetchUserWorkspace = createAsyncThunk(
  "workspace/fetchUserWorkspace",
  async (userId) => {
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  }
);

const initialState = {
  byWorkspaceId: {},
};

const workspaceMembersSlice = createSlice({
  name: "workspaceMembers",
  initialState,
  reducers: {
    resetWorkspaceMembers: (state) => {
      state.byWorkspaceId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceMembers.pending, (state, action) => {
        const workspaceId = action.meta.arg;
        if (!state.byWorkspaceId[workspaceId]) {
          state.byWorkspaceId[workspaceId] = {
            members: [],
            loading: true,
            error: null,
          };
        } else {
          state.byWorkspaceId[workspaceId].loading = true;
          state.byWorkspaceId[workspaceId].error = null;
        }
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        const { workspaceId, members, cached } = action.payload;
        if (!cached) {
          state.byWorkspaceId[workspaceId] = {
            members,
            loading: false,
            error: null,
          };
        } else {
          state.byWorkspaceId[workspaceId].loading = false;
        }
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        const workspaceId = action.payload?.workspaceId || action.meta.arg;
        const error = action.payload?.error || action.error.message;
        if (!state.byWorkspaceId[workspaceId]) {
          state.byWorkspaceId[workspaceId] = {
            members: [],
            loading: false,
            error,
          };
        } else {
          state.byWorkspaceId[workspaceId].loading = false;
          state.byWorkspaceId[workspaceId].error = error;
        }
      })
      .addCase(addWorkspaceMember.fulfilled, (state, action) => {
        const { userId, workspaceId, role } = action.payload;
        if (!state.byWorkspaceId[workspaceId]) {
          state.byWorkspaceId[workspaceId] = {
            members: [{ user_id: userId, role }],
            loading: false,
            error: null,
          };
        } else {
          state.byWorkspaceId[workspaceId].members.push({
            user_id: userId,
            role,
          });
          state.byWorkspaceId[workspaceId].loading = false;
        }
      })
      .addCase(addWorkspaceMember.rejected, (state, action) => {
        const workspaceId = action.meta.arg.workspaceId;
        const error = action.payload || action.error.message;
        if (!state.byWorkspaceId[workspaceId]) {
          state.byWorkspaceId[workspaceId] = {
            members: [],
            loading: false,
            error,
          };
        } else {
          state.byWorkspaceId[workspaceId].loading = false;
          state.byWorkspaceId[workspaceId].error = error;
        }
      })
      .addCase(fetchUserWorkspace.fulfilled, (state, action) => {
        const { workspace_id } = action.payload;
        if (!state.byWorkspaceId[workspace_id]) {
          state.byWorkspaceId[workspace_id] = {
            members: [],
            loading: false,
            error: null,
          };
        }
      })
      .addCase(fetchUserWorkspace.rejected, (state, action) => {
        const error = action.error.message;
        // Handle error if needed
      });
  },
});

// Selectors
export const selectWorkspaceMembers = (workspaceId) => (state) =>
  state.workspaceMembers.byWorkspaceId[workspaceId]?.members || [];

export const selectLoading = (workspaceId) => (state) =>
  state.workspaceMembers.byWorkspaceId[workspaceId]?.loading || false;

export const selectError = (workspaceId) => (state) =>
  state.workspaceMembers.byWorkspaceId[workspaceId]?.error || null;

export const { resetWorkspaceMembers } = workspaceMembersSlice.actions;
export default workspaceMembersSlice.reducer;
