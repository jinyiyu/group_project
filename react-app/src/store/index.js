import { configureStore, createSlice } from "@reduxjs/toolkit";
import  userReducer from './userSlice/userSlice'
import  documentReducer from './documentSlice/documentSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    document: documentReducer,
  },
  
  devTools: true,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
