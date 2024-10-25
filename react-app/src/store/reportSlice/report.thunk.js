import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createReportThunk = createAsyncThunk(
  "report/createReportThunk",
  async (reportData, thunkAPI) => {
    try {
      const response = await axios.post("/users/reports", reportData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchReportsThunk = createAsyncThunk(
  "report/fetchReportsThunk",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/users/reports");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addCommentThunk = createAsyncThunk(
  "report/addCommentThunk",
  async ({ reportId, comment }, thunkAPI) => {
    try {
      const response = await axios.post(`/users/${reportId}/comments`, {
        desc: comment,
      });

      const updatedReport = response.data;

      if (updatedReport.status !== "In Progress") {
        await thunkAPI.dispatch(
          changeReportStatusThunk({ reportId, status: "In Progress" })
        );
      }

      return updatedReport;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "report/updateCommentThunk",
  async ({ reportId, commentId, desc }, thunkAPI) => {
    try {
      const response = await axios.put(
        `/users/${reportId}/comments/${commentId}`,
        { desc }
      );

      const updatedReport = response.data;
      if (updatedReport.status !== "In Progress") {
        await thunkAPI.dispatch(
          changeReportStatusThunk({ reportId, status: "In Progress" })
        );
      }

      return updatedReport;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changeReportStatusThunk = createAsyncThunk(
  "report/changeReportStatusThunk",
  async ({ reportId, status }, thunkAPI) => {
    try {
      const response = await axios.patch(`/users/${reportId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
