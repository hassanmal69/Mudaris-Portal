import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// Thunk
export const fetchChannelMembers = createAsyncThunk(
  "channelMembers/fetchChannelMembers",
  async (channelId) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select("id, role, user_profiles ( id, full_name, email, avatar_url )")
      .eq("channel_id", channelId);

    if (error) throw error;
    return { channelId, members: data };
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
