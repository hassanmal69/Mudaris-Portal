import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient.js";

// Thunks

const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async (workspaceId, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("workspace_id", workspaceId);

    if (error) return rejectWithValue(error.message);
    return data;
  }
);
export const selectChannels = createSelector(
  (state) => state.channels.allIds,
  (state) => state.channels.byId,
  (allIds, byId) => allIds.map((id) => byId[id])
);
const createChannel = createAsyncThunk(
  "channels/createChannel",
  async (
    {
      channel_name,
      description,
      visibility = "public",
      channel_members,
      workspace_id,
      creator_id,
    },
    { rejectWithValue }
  ) => {
    try {
      const { data: channel, error: channelError } = await supabase
        .from("channels")
        .insert([
          {
            channel_name,
            description,
            visibility,
            workspace_id,
          },
        ])
        .select()
        .single();

      if (channelError) return rejectWithValue(channelError.message);
      let membersSet = new Set();
      if (visibility === "public") {
        // if visibility is public all members of the specific workspace will be member of the channel
        const { data: workspaceMembers, error: workspaceError } = await supabase
          .from("workspace_members")
          .select("user_id")
          .eq("workspace_id", workspace_id);

        if (workspaceError) rejectWithValue(workspaceError);
        workspaceMembers.forEach((wm) => membersSet.add(wm.user_id));
      } else {
        // private  channel -> only invited users
        if (channel_members && channel_members.length > 0) {
          channel_members.forEach((userId) => membersSet.add(userId));
        }
      }
      if (creator_id) {
        membersSet.add(creator_id); // adding creator of the channel
      }

      const membersToInsert = Array.from(membersSet).map((userId) => ({
        channel_id: channel.id,
        user_id: userId,
      }));

      if (membersToInsert.length > 0) {
        const { error: membersError } = await supabase
          .from("channel_members")
          .insert(membersToInsert);
        if (membersError) rejectWithValue(membersError.message);
      }

      return channel;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const updateChannel = createAsyncThunk(
  "channels/updateChannel",
  async ({ id, updates }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("channels")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

const deleteChannel = createAsyncThunk(
  "channels/deleteChannel",
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from("channels").delete().eq("id", id);

    if (error) return rejectWithValue(error.message);
    return id;
  }
);

// Real-time subscription handler
let channelSubscription = null;

const subscribeToChannelChanges = () => (dispatch) => {
  if (channelSubscription) return; // Prevent duplicate subscriptions

  channelSubscription = supabase
    .channel("channels_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "channels" },
      (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        if (eventType === "INSERT") {
          dispatch(channelsSlice.actions.channelInserted(newRow));
        } else if (eventType === "UPDATE") {
          dispatch(channelsSlice.actions.channelUpdated(newRow));
        } else if (eventType === "DELETE") {
          dispatch(channelsSlice.actions.channelDeleted(oldRow.id));
        }
      }
    )
    .subscribe();
};

const unsubscribeFromChannelChanges = () => {
  if (channelSubscription) {
    supabase.removeChannel(channelSubscription);
    channelSubscription = null;
  }
};

// Initial State
const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

// Slice
const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    channelInserted: (state, action) => {
      const channel = action.payload;
      state.byId[channel.id] = channel;
      if (!state.allIds.includes(channel.id)) {
        state.allIds.push(channel.id);
      }
    },
    channelUpdated: (state, action) => {
      const channel = action.payload;
      if (state.byId[channel.id]) {
        state.byId[channel.id] = channel;
      }
    },
    channelDeleted: (state, action) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((cid) => cid !== id);
    },
    resetChannels: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((channel) => {
          state.byId[channel.id] = channel;
          state.allIds.push(channel.id);
        });
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const channel = action.payload;
        state.byId[channel.id] = channel;
        if (!state.allIds.includes(channel.id)) {
          state.allIds.push(channel.id);
        }
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const channel = action.payload;
        if (state.byId[channel.id]) {
          state.byId[channel.id] = channel;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const id = action.payload;
        delete state.byId[id];
        state.allIds = state.allIds.filter((cid) => cid !== id);
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  channelInserted,
  channelUpdated,
  channelDeleted,
  resetChannels,
} = channelsSlice.actions;

export {
  fetchChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  subscribeToChannelChanges,
  unsubscribeFromChannelChanges,
};

export default channelsSlice.reducer;
