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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
