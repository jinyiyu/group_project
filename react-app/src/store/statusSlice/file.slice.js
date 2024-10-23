import { uploadFileThunk } from "./status.thunk";
import { createSlice } from "@reduxjs/toolkit";

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState: {
    document: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadFileThunk.fulfilled, (state, action) => {
        state.document = action.payload;
      });
  },
});

export default fileUploadSlice.reducer;
