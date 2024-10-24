import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllHouses,
  addHouse,
  deleteHouse,
  fetchHouseDetail,
  addCommentToFacilityReport,
  updateCommentToFacilityReport,
} from "./hrHousing.thunk";

const initialState = {
  houses: [],
  houseDetails: null,
  loading: false,
  error: null,
};

const hrHousingSlice = createSlice({
  name: "hrHousing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllHouses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.houses = action.payload;
      })
      .addCase(fetchAllHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHouseDetail.pending, (state) => {
        state.loading = true;
        state.houseDetails = null;
      })
      .addCase(fetchHouseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.houseDetails = action.payload;
      })
      .addCase(fetchHouseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addHouse.fulfilled, (state, action) => {
        state.houses.push(action.payload);
      })
      .addCase(deleteHouse.fulfilled, (state, action) => {
        state.houses = state.houses.filter(
          (house) => house.id !== action.payload
        );
      })
      .addCase(addCommentToFacilityReport.fulfilled, (state, action) => {
        const report = state.houseDetails.facilityReports.find(
          (report) => report.id === action.meta.arg.reportId
        );
        if (report) {
          report.comments.push(action.payload);
        }
      })
      .addCase(updateCommentToFacilityReport.fulfilled, (state, action) => {
        const report = state.houseDetails.facilityReports.find(
          (report) => report.id === action.meta.arg.reportId
        );
        const comment = report.comments.find(
          (comment) => comment.id === action.meta.arg.commentId
        );
        if (comment) {
          comment.desc = action.payload.description;
          comment.timestamp = new Date().toISOString();
        }
      });
  },
});

export default hrHousingSlice.reducer;
