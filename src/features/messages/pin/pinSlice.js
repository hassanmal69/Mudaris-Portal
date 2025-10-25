import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// ✅ Fetch all pinned messages for a channel
export const fetchPinnedMessages = createAsyncThunk(
  "pinnedMessages/fetchPinnedMessages",
  async (channelId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("pinned_messages")
        .select(
          `
          id,
          pinned_at,
          message_id,
          pinned_by,
          messages (
            id,
            content,
            sender_id,
            created_at
          ),
          profiles (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .eq("channel_id", channelId)
        .order("pinned_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Toggle pin/unpin message
export const togglePinMessage = createAsyncThunk(
  "pinnedMessages/togglePinMessage",
  async ({ channelId, messageId, userId }, { rejectWithValue }) => {
    try {
      // 1️⃣ Check if message is already pinned
      const { data: existingRows, error: existingError } = await supabase
        .from("pinned_messages")
        .select("id")
        .eq("channel_id", channelId)
        .eq("message_id", messageId);

      // ignore "no rows found" (code PGRST116)
      if (existingError && existingError.code !== "PGRST116") {
        throw existingError;
      }
      const existing = existingRows?.[0]; // ✅ fix here

      // 2️⃣ If already pinned → unpin
      if (existing) {
        const { error: deleteError } = await supabase
          .from("pinned_messages")
          .delete()
          .eq("id", existing.id);

        if (deleteError) throw deleteError;

        return { messageId, unpinned: true };
      }

      // 3️⃣ If not pinned → pin it
      const { data, error } = await supabase
        .from("pinned_messages")
        .insert([
          {
            channel_id: channelId,
            message_id: messageId,
            pinned_by: userId,
          },
        ])
        .select(
          `
          id,
          pinned_at,
          message_id,
          pinned_by,
          messages (
            id,
            content,
            sender_id,
            created_at
          ),
          profiles (
            id,
            full_name,
            avatar_url
          )
        `
        )

        .maybeSingle(); // ✅ optional for safety

      if (error) throw error;

      return { ...data, unpinned: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice definition
const pinSlice = createSlice({
  name: "pinnedMessages",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📥 Fetch pinned messages
      .addCase(fetchPinnedMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPinnedMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPinnedMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Toggle pin/unpin
      .addCase(togglePinMessage.fulfilled, (state, action) => {
        if (action.payload.unpinned) {
          // remove from pinned list
          state.items = state.items.filter(
            (msg) => msg.message_id !== action.payload.messageId
          );
        } else {
          // add new pinned message
          state.items.unshift(action.payload);
        }
      });
  },
});

export default pinSlice.reducer;
