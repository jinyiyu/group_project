import { configureStore } from "@reduxjs/toolkit";
import housingReducer from "./housingSlice/housing.slice";
import reportReducer from "./reportSlice/report.slice";

const store = configureStore({
  reducer: {
    housing: housingReducer,
    report: reportReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
