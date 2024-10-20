import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    allEmployees: [],
    searchQuery: "",
    dropdownVisible: false,
    displayedEmployees: [],
  },
  reducers: {
    setEmployees: (state, action) => {
      state.allEmployees = action.payload;
      state.displayedEmployees = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setDropdownVisible: (state, action) => {
      state.dropdownVisible = action.payload;
    },
    setDisplayedEmployees: (state, action) => {
      state.displayedEmployees = action.payload;
    },
  },
});

export const {
  setEmployees,
  setSearchQuery,
  setDropdownVisible,
  setDisplayedEmployees,
} = employeeSlice.actions;
export default employeeSlice.reducer;
