import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllHouses,
  addHouse,
  deleteHouse,
  fetchHouseDetail,
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
      });
  },
});

export default hrHousingSlice.reducer;
