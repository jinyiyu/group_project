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
  async ({ houseId, page }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASED_URI}/hr/housing/${houseId}?page=${page}`
      );
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

export const addCommentToFacilityReport = createAsyncThunk(
  "hrHousing/addCommentToFacilityReport",
  async ({ reportId, description, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASED_URI}/hr/housing/reports/${reportId}/comments`,
        {
          description,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCommentToFacilityReport = createAsyncThunk(
  "hrHousing/updateCommentToFacilityReport",
  async (
    { reportId, commentId, description, currentUserId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${BASED_URI}/hr/housing/reports/${reportId}/comments/${commentId}`,
        {
          description,
          currentUserId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
