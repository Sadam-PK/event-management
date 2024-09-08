import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

export const user = createAsyncThunk(
  "user/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUser();
      return response;
    } catch (error) {
      console.error("Error in user thunk:", error); // Add this line
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
      .addCase(user.pending, (state) => {
        state.status = "loading";
      })
      .addCase(user.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(user.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});


export const { logout } = userSlice.actions;
export default userSlice.reducer;
