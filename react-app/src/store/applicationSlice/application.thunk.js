import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASED_URI = "http://localhost:3000";

// Fetch applications
export const fetchApplications = createAsyncThunk(
  "application/fetchApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASED_URI}/hr/hiring/applications`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching applications"
      );
    }
  }
);

// Fetch individual application
export const fetchIndividualApplication = createAsyncThunk(
  "application/fetchIndividualApplication",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASED_URI}/hr/hiring/applications/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching application"
      );
    }
  }
);

// Give feedback
export const giveFeedback = createAsyncThunk(
  "application/giveFeedback",
  async ({ userId, description, createdBy }, { rejectWithValue }) => {
    try {
      console.log(userId);
      await axios.put(
        `${BASED_URI}/hr/hiring/applications/${userId}/feedback`,
        {
          description,
          createdBy,
        }
      );
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error giving feedback");
    }
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  "application/updateApplicationStatus",
  async ({ userId, status, feedback }, { rejectWithValue }) => {
    try {
      await axios.put(`${BASED_URI}/hr/hiring/applications/${userId}`, {
        status,
        feedback,
      });
      return { userId, status, feedback };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating status");
    }
  }
);
