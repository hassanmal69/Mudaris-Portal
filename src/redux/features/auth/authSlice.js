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

// --- session detection Thunk ---
export const sessionDetection = createAsyncThunk(
  "auth/sessionDetect",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        rejectWithValue(error);
        return;
      }
      dispatch(
        setSession({
          session,
          token: session?.access_token || null,
        })
      );
      return session;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);
// --- Signup Thunk ---
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ fullName, email, password, avatarUrl }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: null,
          data: {
            fullName,
            user_role: "user",
            avatar: avatarUrl,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          return rejectWithValue("Incorrect password");
        }
        console.error("Signup error:", error);
        return rejectWithValue(error.message || "Login failed");
      }

      return {
        user: data.user,
        session: data.session || null,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
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

      return session;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      localStorage.removeItem("session");
      localStorage.removeItem("token");

      return true; // success signal
    } catch (err) {
      return rejectWithValue(err.message || "Logout failed");
    }
  }
);

const initialState = {
  session: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.session = null;
      state.token = null;
      state.user = null;
      state.loading = false;
    },
    setSession: (state, action) => {
      state.session = action.payload.session ?? null;
      state.token = action.payload.token ?? null;
      state.user = action.payload.session?.user ?? null;
      state.loading = false;
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
        state.user = action.payload.user;
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
        state.error = action.payload || "Login Failed";
      })

      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loading = false;
        state.session = null;
        state.token = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setSession } = authSlice.actions;
export default authSlice.reducer;
