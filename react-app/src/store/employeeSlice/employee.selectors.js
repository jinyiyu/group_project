export const selectAllEmployees = (state) => state.employees.allEmployees;
export const selectSearchQuery = (state) => state.employees.searchQuery;
export const selectDropdownVisible = (state) => state.employees.dropdownVisible;
export const selectDisplayedEmployees = (state) =>
  state.employees.displayedEmployees;
export const selectEmployeesWithPendingDocs = (state) =>
  state.employees.employeesWithPendingDocs;
export const selectVisaEmployees = (state) => state.employees.visaEmployees;
export const selectEmployeeLoading = (state) => state.employees.loading;
export const selectEmployeeError = (state) => state.employees.error;
