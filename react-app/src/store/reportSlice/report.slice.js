import { createSlice } from "@reduxjs/toolkit";
import {
  createReportThunk,
  fetchReportsThunk,
  addCommentThunk,
  updateCommentThunk,
} from "./report.thunk";

const reportSlice = createSlice({
  name: "report",
  initialState: {
    reports: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createReportThunk.fulfilled, (state, action) => {
        state.reports.push(action.payload.report);
      })
      .addCase(fetchReportsThunk.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        const report = state.reports.find(
          (report) => report._id === action.payload.report._id
        );
        if (report) {
          report.comments = action.payload.report.comments;
        }
      })
      .addCase(updateCommentThunk.fulfilled, (state, action) => {
        const updatedReport = action.payload.report;
        state.reports = state.reports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        );
      });
  },
});

export default reportSlice.reducer;
