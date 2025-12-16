import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

export const fetchChannelMembersByChannel = createAsyncThunk(
  "channelMembers/fetchByChannel",
  async (channelId, thunkAPI) => {
    const state = thunkAPI.getState();
    const cached = state.channelMembers.byChannelId[channelId];

    if (cached && cached.status === "succeeded" && cached.data.length > 0) {
      return { channelId, members: cached.data, fromCache: true };
    }


    const { data, error } = await supabase
      .from("channel_members")
      .select(
        "id, user_id, user_profiles ( id, full_name, avatar_url, email )"
      )
      .eq("channel_id", channelId);

    if (error) return thunkAPI.rejectWithValue(error.message);

    return { channelId, members: data };
  }
);

// fetch channels for a given user
export const fetchChannelMembersbyUser = createAsyncThunk(
  "channelMembers/fetchByUser",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const cached = state.channelMembers.byUserId[userId];

    if (cached && cached.status === "succeeded" && cached.data.length > 0) {
      return { userId, channel: cached.data, fromCache: true };
    }


    const { data, error } = await supabase
      .from("channel_members")
      .select(
        "id, channels ( id, channel_name, visibility, workspace_id )"
      )
      .eq("user_id", userId);

    if (error) return thunkAPI.rejectWithValue(error.message);

    return { userId, channel: data };
  }
);

export const addChannelMembersonSignUp = createAsyncThunk(
  "channelMembers/addChannelMembersonSignUp",
  async ({ channelId, userId }, { rejectWithValue }) => {
    const { error } = await supabase.from("channel_members").insert({
      channel_id: channelId,
      user_id: userId,
    });

    if (error) return rejectWithValue(error.message);
    return { channelId, userId };
  }
);

export const addChannelMembers = createAsyncThunk(
  "channelMembers/addChannelMembers",
  async ({ channelId, userIds }, { rejectWithValue }) => {
    const rows = userIds.map((id) => ({
      user_id: id,
      channel_id: channelId,
    }));

    const { data, error } = await supabase
      .from("channel_members")
      .insert(rows);

    if (error) return rejectWithValue(error.message);
    return { channelId, members: data };
  }
);

const channelMembersSlice = createSlice({
  name: "channelMembers",
  initialState: {
    byChannelId: {},
    byUserId: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- CHANNEL MEMBERS ---------- */
      .addCase(fetchChannelMembersByChannel.pending, (state, action) => {
        const channelId = action.meta.arg;
        state.byChannelId[channelId] ??= {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembersByChannel.fulfilled, (state, action) => {
        const { channelId, members } = action.payload;
        state.byChannelId[channelId] = {
          data: members,
          status: "succeeded",
        };
      })
      .addCase(fetchChannelMembersByChannel.rejected, (state, action) => {
        const channelId = action.meta.arg;
        state.byChannelId[channelId] = {
          data: [],
          status: "failed",
          error: action.error.message,
        };
      })

      /* ---------- USER CHANNELS ---------- */
      .addCase(fetchChannelMembersbyUser.pending, (state, action) => {
        const userId = action.meta.arg;
        state.byUserId[userId] ??= {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembersbyUser.fulfilled, (state, action) => {
        const { userId, channel } = action.payload;
        state.byUserId[userId] = {
          data: channel,
          status: "succeeded",
        };
      })
      .addCase(fetchChannelMembersbyUser.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.byUserId[userId] = {
          data: [],
          status: "failed",
          error: action.error.message,
        };
      });
  },
});

/* ======================================================
   SELECTORS
====================================================== */

const EMPTY_ARRAY = [];

export const selectChannelMembers = (channelId) => (state) =>
  state.channelMembers.byChannelId[channelId]?.data || EMPTY_ARRAY;

export const selectChannelMembershipsForUser = (userId) =>
  createSelector(
    [(state) => state.channelMembers.byUserId[userId]],
    (membershipData) => {
      if (!membershipData?.data) return EMPTY_ARRAY;
      return membershipData.data.filter((m) => m.channels);
    }
  );

export const selectChannelsByUser = (userId, workspace_id) =>
  createSelector(
    [selectChannelMembershipsForUser(userId), () => workspace_id],
    (memberships, workspace_id) =>
      memberships
        .map((m) => m.channels)
        .filter((ch) => ch && ch.workspace_id === workspace_id)
  );

export default channelMembersSlice.reducer;
