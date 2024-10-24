// store/authSlice/auth.thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASED_URI = "http://localhost:3000";

export const generateToken = createAsyncThunk(
  "auth/generateToken",
  async ({ email, fullName }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${BASED_URI}/hr/hiring/token`, {
        email,
        fullName,
      });
      dispatch(fetchTokenHistory());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error generating token");
    }
  }
);

export const fetchTokenHistory = createAsyncThunk(
  "auth/fetchTokenHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASED_URI}/hr/hiring/token`);
      return response.data.history;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch token history"
      );
    }
  }
);
