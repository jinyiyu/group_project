// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../redux/employeeSlice"; // Adjust the path as needed

const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
});

export default store;
