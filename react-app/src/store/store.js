import { configureStore } from "@reduxjs/toolkit";
import housingReducer from "./housingSlice/housing.slice";
import reportReducer from "./reportSlice/report.slice";
import statusReducer from "./statusSlice/status.slice";
import fileReducer from "./statusSlice/file.slice";
import employeeReducer from "../redux/employeeSlice";
import authReducer from "../redux/authSlice.js";
import userReducer from "./userSlice/userSlice";
import documentReducer from "./documentSlice/documentSlice";

const store = configureStore({
  reducer: {
    housing: housingReducer,
    report: reportReducer,
    userStatus: statusReducer,
    fileUpload: fileReducer,
    auth: authReducer,
    employees: employeeReducer,
    user: userReducer,
    document: documentReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
