import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPendingDocsThunk,
  fetchVisaEmployeesThunk,
  updateWithFeedbackThunk,
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

    // Asynchronous action for updating employee feedback
    builder
      .addCase(updateWithFeedbackThunk.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error
        state.message = null; // Reset message
      })
      .addCase(updateWithFeedbackThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message; // Set success message

        // Update employee data in state
        const updatedData = action.payload.data; // Assuming this contains updated employee data
        const index = state.allEmployees.findIndex(
          (emp) => emp._id === updatedData._id
        );
        if (index !== -1) {
          state.allEmployees[index] = {
            ...state.allEmployees[index],
            ...updatedData,
          }; // Update the employee data
        }
      })
      .addCase(updateWithFeedbackThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
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
