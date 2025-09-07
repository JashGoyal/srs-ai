
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const DELETE_URL = "http://localhost:8080/api/srs/delete";

export const deleteSrsById = createAsyncThunk(
  'srs/deleteById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${DELETE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete");
    }
  }
);

const deleteSrsSlice = createSlice({
  name: 'deleteSrs',
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearDeleteStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSrsById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteSrsById.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteSrsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearDeleteStatus } = deleteSrsSlice.actions;

export default deleteSrsSlice.reducer;
