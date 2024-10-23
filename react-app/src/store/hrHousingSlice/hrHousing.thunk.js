import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASED_URI = "http://localhost:3000";

export const fetchAllHouses = createAsyncThunk(
  "hrHousing/fetchAllHouses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASED_URI}/hr/housing`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchHouseDetail = createAsyncThunk(
  "hrHousing/fetchHouseDetail",
  async (houseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASED_URI}/hr/housing/${houseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addHouse = createAsyncThunk(
  "hrHousing/addHouse",
  async (newHouse, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASED_URI}/hr/housing`, newHouse);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHouse = createAsyncThunk(
  "hrHousing/deleteHouse",
  async (houseId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASED_URI}/hr/housing/${houseId}`);
      return houseId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
