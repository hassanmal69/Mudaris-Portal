import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// Thunk
export const fetchChannelMembers = createAsyncThunk(
  "channelMembers/fetchChannelMembers",
  async (channelId) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select("id, user_profiles ( id, full_name, email, avatar_url )")
      .eq("channel_id", channelId);

    if (error) throw error;
    return { channelId, members: data };
  }
);
export const addChannelMembers = createAsyncThunk(
  "channelMembers/addChannelMembers",
  async ({ channelId, userIds }, { rejectWithValue }) => {
    try {
      // Prepare rows for Supabase insert
      const rows = userIds.map((userId) => ({
        channel_id: channelId,
        user_id: userId,
      }));

      const { data, error } = await supabase
        .from("channel_members")
        .insert(rows)
        .select("id, channel_id, user_id");

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
        const channelId = action.meta.arg;
        state.byChannelId[channelId] = {
          data: [],
          status: "loading",
        };
      })
      .addCase(fetchChannelMembers.fulfilled, (state, action) => {
        const { channelId, members } = action.payload;
        state.byChannelId[channelId] = {
          data: members,
          status: "succeeded",
        };
      })
      .addCase(addChannelMembers.fulfilled, (state, action) => {
        const { channelId, members } = action.payload;

        if (!state.byChannelId[channelId]) {
          state.byChannelId[channelId] = { data: [], status: "succeeded" };
        }

        // append all new members
        state.byChannelId[channelId].data.push(...members);
        state.status = "succeeded";
      })

      .addCase(fetchChannelMembers.rejected, (state, action) => {
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
