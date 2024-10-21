
// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../redux/employeeSlice";
import authReducer from "../redux/authSlice.js";
import userReducer from "./userSlice/userSlice";
import documentReducer from "./documentSlice/documentSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    user: userReducer,
    document: documentReducer,

  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
