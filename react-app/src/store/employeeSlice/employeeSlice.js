import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPendingDocsThunk,
  fetchVisaEmployeesThunk,
} from "./employee.thunk";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    allEmployees: [],
    searchQuery: "",
    dropdownVisible: false,
    displayedEmployees: [],
    employeesWithPendingDocs: [],
    visaEmployees: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous actions
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
  extraReducers: (builder) => {
    // Asynchronous actions for pending documents
    builder
      .addCase(fetchPendingDocsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingDocsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.employeesWithPendingDocs = action.payload;
      })
      .addCase(fetchPendingDocsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Asynchronous actions for visa employees
    builder
      .addCase(fetchVisaEmployeesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisaEmployeesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.visaEmployees = action.payload;
      })
      .addCase(fetchVisaEmployeesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEmployees,
  setSearchQuery,
  setDropdownVisible,
  setDisplayedEmployees,
} = employeeSlice.actions;

export default employeeSlice.reducer;
