// store/authSlice/auth.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { generateToken, fetchTokenHistory } from "./auth.thunk";

const initialState = {
  loading: false,
  success: false,
  token: null,
  error: null,
  tokenHistory: [],
  historyLoading: false,
  historyError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Generate Token
      .addCase(generateToken.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
      })
      .addCase(generateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Token History
      .addCase(fetchTokenHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchTokenHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.tokenHistory = action.payload;
      })
      .addCase(fetchTokenHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

export default authSlice.reducer;
