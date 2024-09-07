import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

export const login = createAsyncThunk("auth/login", async (user, thunkApi) => {
  try {
    const response = await authService.loginUser(user);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response ? error.response.data : error.message
    );
  }
});

const getUserDataFromLocalStorage = localStorage.getItem("token") || null;

const initialState = {
  user: getUserDataFromLocalStorage,
  status: "idle",
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token); // Store token in localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the logout action so it can be used in components
export const { logout } = authSlice.actions;

export default authSlice.reducer;
