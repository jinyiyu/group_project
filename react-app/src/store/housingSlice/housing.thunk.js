import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const initHousingThunk = createAsyncThunk(
  "housing/initHousingThunk",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/user/housing");
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.log("API Error:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
