import { uploadFileThunk } from "./status.thunk";
import { createSlice } from "@reduxjs/toolkit";

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState: {
    document: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadFileThunk.fulfilled, (state, action) => {
      state.document = action.payload;
    });
  },
});

export default fileUploadSlice.reducer;
