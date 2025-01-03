import { configureStore } from "@reduxjs/toolkit";
import housingReducer from "./housingSlice/housing.slice";
import reportReducer from "./reportSlice/report.slice";
import statusReducer from "./statusSlice/status.slice";
import fileReducer from "./statusSlice/file.slice";
import employeeReducer from "./employeeSlice/employeeSlice.js";
import userAuthReducer from "./authSlice/authSlice.js";
import userReducer from "./userSlice/userSlice";
import documentReducer from "./documentSlice/documentSlice";
import authReducer from "./hrAuthSlice/auth.slice";
import applicationReducer from "./applicationSlice/application.slice.js";
import hrHousingReducer from "./hrHousingSlice/hrHousing.slice";

const store = configureStore({
  reducer: {
    housing: housingReducer,
    report: reportReducer,
    userStatus: statusReducer,
    fileUpload: fileReducer,
    userAuth: userAuthReducer,
    employees: employeeReducer,
    user: userReducer,
    document: documentReducer,
    auth: authReducer,
    application: applicationReducer,
    hrHousing: hrHousingReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
