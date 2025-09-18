import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL + '/getsrs';

export const fetchSrsHistory = createAsyncThunk(
  'srs/fetchSrsHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

const srsHistorySlice = createSlice({
  name: 'srsHistory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSrsHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSrsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSrsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default srsHistorySlice.reducer;
