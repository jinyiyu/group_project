import { configureStore, createSlice } from "@reduxjs/toolkit";
import  userReducer from './userSlice/userSlice'
import  documentReducer from './documentSlice/documentSlice'
import employeeReducer from "../redux/employeeSlice"; // Adjust the path as needed


const store = configureStore({
  reducer: {
    user: userReducer,
    document: documentReducer,
    employees: employeeReducer,
  },
  
  devTools: true,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
