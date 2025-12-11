import { supabase } from "@/services/supabaseClient";
import { createSlice } from "@reduxjs/toolkit";

export const fetchLastSeen = () => async (dispatch) => {
  const { data, error } = await supabase.from("last_seen").select("*");

  if (error) {
    console.error("❌ Error fetching last_seen:", error);
    return;
  }

  const formatted = {};
  data.forEach((row) => {
    formatted[row.channel_id] = row.last_seen;
  });

  dispatch(setLastSeenBatch(formatted));
};

const lastSeenSlice = createSlice({
  name: "lastSeen",
  initialState: {
    data: {},        // holds { channelId: timestamp }
    loaded: false,   // signals readiness
    error: null
  },
  reducers: {
    setLastSeen: (state, action) => {
      const { channelId, timestamp } = action.payload;
      state.data[channelId] = timestamp;
    },

    setLastSeenBatch: (state, action) => {
      state.data = action.payload;  
      state.loaded = true;
    },
  },
});

export const { setLastSeen, setLastSeenBatch } = lastSeenSlice.actions;

export default lastSeenSlice.reducer;
