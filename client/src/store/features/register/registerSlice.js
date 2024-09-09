import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userRegister = createAsyncThunk(
  "register/userRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/user/signup`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: {
      _id: null,
      name: null,
      username: null,
      role: null,
      token: null,
    },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user._id = action.payload._id;
        state.user.name = action.payload.name;
        state.user.username = action.payload.username;
        state.user.role = action.payload.role;
        state.user.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default registerSlice.reducer;
