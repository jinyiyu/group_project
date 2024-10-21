import { createSlice } from "@reduxjs/toolkit";
import { initHousingThunk } from "./housing.thunk";

const housingSlice = createSlice({
  name: "housing",
  initialState: {
    houseAddress: "",
    roommates: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initHousingThunk.fulfilled, (state, action) => {
      state.houseAddress = action.payload.houseAddress;
      state.roommates = action.payload.roommates || [];
    });
  },
});

export default housingSlice.reducer;
