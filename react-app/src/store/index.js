// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../redux/employeeSlice"; // Adjust the path as needed
import authReducer from "../redux/authSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
  },
});

export default store;
