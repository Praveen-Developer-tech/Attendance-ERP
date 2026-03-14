import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "./services/authService";
import type { User } from "../../types";

export interface AuthState {
  user?: User;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: AuthState = {
  user: authService.getStoredUser(),
  status: "idle",
  error: undefined,
};

export const login = createAsyncThunk("auth/login", async (payload: { email: string; password: string }) => {
  const user = authService.authenticate(payload.email, payload.password);
  return user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
      authService.clearStoredUser();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
