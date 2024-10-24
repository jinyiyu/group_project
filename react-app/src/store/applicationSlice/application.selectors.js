// Selectors for accessing application state
export const selectLoading = (state) => state.application.loading;
export const selectNotStartedApplications = (state) =>
  state.application.notStarted;
export const selectPendingApplications = (state) => state.application.pending;
export const selectApprovedApplications = (state) => state.application.approved;
export const selectRejectedApplications = (state) => state.application.rejected;
export const selectApplicationError = (state) => state.application.error;
export const selectIndividualApplication = (state) =>
  state.application.application;
