import { configureStore } from "@reduxjs/toolkit";
import housingReducer from "./housingSlice/housing.slice";
import reportReducer from "./reportSlice/report.slice";
import statusReducer from "./statusSlice/status.slice";
import fileReducer from "./statusSlice/file.slice";

const store = configureStore({
  reducer: {
    housing: housingReducer,
    report: reportReducer,
    userStatus: statusReducer,
    fileUpload: fileReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
