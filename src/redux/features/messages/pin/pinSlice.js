import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

// ✅ Fetch pinned messages
export const fetchPinnedMessages = createAsyncThunk(
  "pinnedMessages/fetchPinnedMessages",
  async ({ channelId, token }, { rejectWithValue }) => {
    try {
      let query = supabase
        .from("pinned_messages")
        .select(`
          id,
          pinned_at,
          message_id,
          pinned_by,
          messages (
            id,
            content,
            created_at,
            sender_id
          ),
          profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .order("pinned_at", { ascending: false });

      if (channelId) query = query.eq("channel_id", channelId);
      else if (token) query = query.eq("token", token);
      else return rejectWithValue("Either channelId or token must be provided");

      const { data, error } = await query;

      if (error) throw error;

      return data.map((item) => ({
        full_name: item.profiles?.full_name || "",
        avatar_url: item.profiles?.avatar_url || "",
        pinned_at: item.pinned_at,
        message_id: item.messages?.id,
        content: item.messages?.content || "",
        userId: item.profiles?.sender_id,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Toggle pin/unpin (supports both channelId and token)
export const togglePinMessage = createAsyncThunk(
  "pinnedMessages/togglePinMessage",
  async ({ channelId, messageId, userId, token }, { rejectWithValue }) => {
    try {
      if (!channelId && !token)
        return rejectWithValue("Either channelId or token must be provided");

      // Build base query conditionally
      const baseQuery = supabase.from("pinned_messages").select("id");
      if (channelId) baseQuery.eq("channel_id", channelId);
      if (token) baseQuery.eq("token", token);
      baseQuery.eq("message_id", messageId);

      const { data: existingRows, error: existingError } = await baseQuery;
      if (existingError && existingError.code !== "PGRST116") throw existingError;

      const existing = existingRows?.[0];

      // 1️⃣ Unpin if already pinned
      if (existing) {
        const deleteQuery = supabase.from("pinned_messages").delete().eq("id", existing.id);
        await deleteQuery;
        return { messageId, unpinned: true };
      }

      // 2️⃣ Pin if not pinned
      const insertData = { message_id: messageId, pinned_by: userId };
      if (channelId) insertData.channel_id = channelId;
      if (token) insertData.token = token;

      const { data, error } = await supabase
        .from("pinned_messages")
        .insert([insertData])
        .select(`
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
        `)
        .maybeSingle();

      if (error) throw error;

      return { ...data, unpinned: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Slice
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
      .addCase(togglePinMessage.fulfilled, (state, action) => {
        if (action.payload.unpinned) {
          state.items = state.items.filter(
            (msg) => msg.message_id !== action.payload.messageId
          );
        } else {
          state.items.unshift(action.payload);
        }
      });
  },
});

export default pinSlice.reducer;
