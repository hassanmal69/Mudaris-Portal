import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// Thunk
export const fetchChannelMembers = createAsyncThunk(
  "channelMembers/fetchChannelMembers",
  async (userId) => {
    const { data, error } = await supabase
      .from("channel_members")
      .select("id, channels ( id, channel_name,visibility )")
      .eq("user_id", userId);

    if (error) throw error;
    return { userId, channel: data };
  }
);
export const addChannelMembers = createAsyncThunk(
  "channelMembers/addChannelMembers",
  async ({ channelIds, userId }, { rejectWithValue }) => {
    try {
      // Prepare rows for Supabase insert
      // const rows = channelIds.map((channelId) => ({
      //   channel_id: channelId,
      //   user_id: userId,
      // }));
      console.log('getting data in redux of addChannelMembers', channelIds, userId);
      const { data, error } = await supabase
        .from("channel_members")
        .insert({
          user_id: userId,
          channel_id: channelIds
        })

      if (error) return rejectWithValue(error.message);

      return { channelIds, members: data }; // return all inserted rows
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
//will work on this first have to make sure that
//  chanel members should be updated
// const isMemberSlice = createAsyncThunk(
//   "channelMembers/checkMember",
//   async ({ userId }, { rejectWithValue }) => {
//     try {
//       const { data, error } = await supabase.from('channel_members')

//     } catch (error) {
//       throw new Error(error)
//     }
//   }
// )
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
