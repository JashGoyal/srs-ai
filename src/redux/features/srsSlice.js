
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/srs/generate';

export const generateSrs = createAsyncThunk(
  'srs/generateSrs',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { prompt });
      return response.data;
    } catch (error) {
      console.error("SRS Thunk Error:", error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const srsSlice = createSlice({
  name: 'srs',
  initialState: {
    loading: false,
    error: null,
    result: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateSrs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(generateSrs.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(generateSrs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default srsSlice.reducer;
