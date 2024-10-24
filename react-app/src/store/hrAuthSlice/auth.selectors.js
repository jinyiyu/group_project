// store/authSlice/auth.selectors.js
export const selectLoading = (state) => state.auth.loading;
export const selectSuccess = (state) => state.auth.success;
export const selectToken = (state) => state.auth.token;
export const selectError = (state) => state.auth.error;

export const selectHistoryLoading = (state) => state.auth.historyLoading;
export const selectTokenHistory = (state) => state.auth.tokenHistory;
export const selectHistoryError = (state) => state.auth.historyError;
