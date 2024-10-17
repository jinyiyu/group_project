import { configureStore, createSlice } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice/todo.slice";

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
  // // you don't have to use third-party libraries to enable Redux devTools anymore
  devTools: true,
  // // the getDefaultMiddleware function contains the thunk middleware, no need to rely on third-party libraries
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
