import { createSlice } from "@reduxjs/toolkit";
import { uploadFileThunk, VisaStatusThunk } from "./status.thunk";

const statusSlice = createSlice({
  name: "userStatus",
  initialState: {
    documentType: null,
    status: null,
    feedback: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(VisaStatusThunk.fulfilled, (state, action) => {
      state.documentType = action.payload.documentType;
      state.status = action.payload.status;
      state.feedback = action.payload.feedback;
    });
  },
});

export default statusSlice.reducer;
