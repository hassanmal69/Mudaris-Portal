import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// Thunk
// export const fetchChannelMembers = createAsyncThunk(
//   "channelMembers/fetchChannelMembers",
//   async (userId) => {
//     const { data, error } = await supabase
//       .from("channel_members")
//       .select("id, channels ( id, channel_name,visibility )")
//       .eq("user_id", userId);

//     if (error) throw error;
//     return { userId, channel: data };
//   }
// );

// channelMembersSlice.js
export const fetchChannelMembers = createAsyncThunk(
  "channelMembers/fetchChannelMembers",
  async (userId) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select(
        `
        id,
        channel_id,
        channels (
          id,
          channel_name,
          visibility,
          workspace_id
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return { userId, channel: data };
  }
);

export const addChannelMembers = createAsyncThunk(
  "channelMembers/addChannelMembers",
  async ({ channelId, userId }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("channel_members").insert({
        user_id: userId,
        channel_id: channelId,
      });

      if (error) return rejectWithValue(error.message);

      return { channelId, members: data }; // return all inserted rows
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
      .addCase(fetchChannelMembers.pending, (state, action) => {
        const userId = action.meta.arg;
        state.byChannelId[userId] = {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembers.fulfilled, (state, action) => {
        const { userId, channel } = action.payload;
        state.byChannelId[userId] = {
          data: channel,
          status: "succeeded",
        };
      })
      .addCase(fetchChannelMembers.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.byChannelId[userId] = {
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
