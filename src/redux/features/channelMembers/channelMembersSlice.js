import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// Thunk
// fetch members for a given channel (used by Topbar)
export const fetchChannelMembersByChannel = createAsyncThunk(
  "channelMembers/fetchByChannel",
  async (channelId, thunkAPI) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select("id, user_id, user_profiles ( id, full_name, avatar_url, email )")
      .eq("channel_id", channelId);

    if (error) return thunkAPI.rejectWithValue(error.message);
    return { channelId, members: data };
  }
);
export const fetchChannelMembersbyUser = createAsyncThunk(
  "channelMembers/fetchByUser",
  async (userId) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select("id, channels ( id, channel_name,visibility,workspace_id )")
      .eq("user_id", userId);
    if (error) throw error;
    return { userId, channel: data };
  }
);
export const addChannelMembersonSignUp = createAsyncThunk(
  "channelMembers/addChannelMembersonSignUp",
  async ({ channelId, userId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("channel_members").insert({
        channel_id: channelId,
        user_id: userId,
      });

      if (error) return rejectWithValue(error.message);

      return { data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const addChannelMembers = createAsyncThunk(
  "channelMembers/addChannelMembers",
  async ({ channelId, userIds }, { rejectWithValue }) => {
    try {
      const rows = userIds.map((id) => ({
        user_id: id,
        channel_id: channelId,
      }));

      const { data, error } = await supabase
        .from("channel_members")
        .insert(rows);

      if (error) return rejectWithValue(error.message);

      return { channelId, members: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const channelMembersSlice = createSlice({
  name: "channelMembers",
  initialState: {
    byChannelId: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelMembersbyUser.pending, (state, action) => {
        const userId = action.meta.arg;
        state.byChannelId[userId] = {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembersbyUser.fulfilled, (state, action) => {
        const { userId, channel } = action.payload;
        state.byChannelId[userId] = {
          data: channel,
          status: "succeeded",
        };
      })
      .addCase(fetchChannelMembersbyUser.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.byChannelId[userId] = {
          data: [],
          status: "failed",
          error: action.error.message,
        };
      })

      .addCase(fetchChannelMembersByChannel.fulfilled, (state, action) => {
        const { channelId, members } = action.payload;
        state.byChannelId[channelId] = {
          data: members,
          status: "succeeded",
        };
      })
      .addCase(fetchChannelMembersByChannel.pending, (state, action) => {
        const channelId = action.meta.arg;
        state.byChannelId[channelId] = {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembersByChannel.rejected, (state, action) => {
        const channelId = action.meta.arg;
        state.byChannelId[channelId] = {
          data: [],
          status: "failed",
          error: action.error.message,
        };
      });
  },
});

export const selectChannelMembers = (channelId) => (state) =>
  state.channelMembers.byChannelId[channelId]?.data || [];

export default channelMembersSlice.reducer;
