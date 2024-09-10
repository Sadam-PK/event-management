import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

export const userMe = createAsyncThunk(
  "user/userMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUser();
      return response;
    } catch (error) {
      // console.error("Error in user thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
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
      .addCase(userMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userMe.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(userMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
