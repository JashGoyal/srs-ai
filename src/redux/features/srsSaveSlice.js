import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/save';

export const saveSrs = createAsyncThunk(
  "srsSave/saveSrs",
  async (srsJson, { rejectWithValue }) => {
    try {
      const payload = { aiResponse: srsJson };

      const response = await axios.post(API_URL, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const srsSaveSlice = createSlice({
  name: "srsSave",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSrs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveSrs.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(saveSrs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save SRS";
      });
  },
});

export const { resetStatus } = srsSaveSlice.actions;

export default srsSaveSlice.reducer;
