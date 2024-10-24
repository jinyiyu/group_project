import { createSlice } from "@reduxjs/toolkit";
import {
  fetchApplications,
  fetchIndividualApplication,
  giveFeedback,
  updateApplicationStatus,
} from "./application.thunk";

const initialState = {
  loading: false,
  notStarted: [],
  pending: [],
  approved: [],
  rejected: [],
  error: null,
  application: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        const notStarted = action.payload.filter(
          (app) => app.onboardStatus === "not started"
        );
        const pending = action.payload.filter(
          (app) => app.onboardStatus.toLowerCase() === "pending"
        );
        const approved = action.payload.filter(
          (app) => app.onboardStatus.toLowerCase() === "approved"
        );
        const rejected = action.payload.filter(
          (app) => app.onboardStatus.toLowerCase() === "rejected"
        );

        state.loading = false;
        state.notStarted = notStarted;
        state.pending = pending;
        state.approved = approved;
        state.rejected = rejected;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch individual application
      .addCase(fetchIndividualApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIndividualApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.application = action.payload;
      })
      .addCase(fetchIndividualApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Give feedback
      .addCase(giveFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(giveFeedback.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(giveFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default applicationSlice.reducer;
