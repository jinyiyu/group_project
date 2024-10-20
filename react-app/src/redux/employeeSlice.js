// src/redux/employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    allEmployees: [],
  },
  reducers: {
    setEmployees: (state, action) => {
      state.allEmployees = action.payload;
    },
  },
});

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
