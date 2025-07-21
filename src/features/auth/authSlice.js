// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/services/supabaseClient";

/**
 * Sign up a new user using Supabase Auth.
 * @param {Object} userData - User input from signup form.
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.fullName
 * @param {string} userData.role
 * @param {string} userData.avatarUrl
 */
// --- Signup Thunk ---
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ fullName, email, password, token }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null,
          data: {
            fullName,
            role: "user",
            avatar: null,
          },
        },
      });

      if (error) return rejectWithValue(error.message);

      const session = data.session;

      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
        if (token) localStorage.setItem("token", token);
      }

      return { session, token, user: data.user };
    } catch (err) {
      return rejectWithValue(err.message || "Signup failed");
    }
  }
);

// --- Login Thunk ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return rejectWithValue(error.message);

      const session = data.session;

      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
      }

      return session;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

const initialState = {
  session: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.session = null;
      state.token = null;
      localStorage.removeItem("session");
      localStorage.removeItem("token");
      supabase.auth.signOut();
    },
    setSession: (state, action) => {
      state.session = action.payload.session;
      state.token = action.payload.token || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setSession } = authSlice.actions;
export default authSlice.reducer;
