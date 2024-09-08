import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from "./eventService";

export const fetchEventsThunk = createAsyncThunk(
  "events/fetchEvents",
  async ({page, query, sortBy, sortOrder, limit}, { rejectWithValue }) => {
    try {
      const response = await eventService.fetchEvents(
        page,
        query,
        sortBy,
        sortOrder,
        limit
      );
      return response;
    } catch (error) {
      // console.error("Error in user thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  events: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = eventsSlice.actions;
export default eventsSlice.reducer;
