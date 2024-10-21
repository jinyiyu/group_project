import { createSlice } from '@reduxjs/toolkit';
import { fetchDocumentThunk } from './documentThunk';

const initialState = {
  profilePicture: "",
  licenseCopy: "",
  OPT_receipt: "",
  OPT_EAD: "",
  I_983: "",
  I_20: "",
}

const documentSlice = createSlice({
  name: 'document',
  initialState: initialState,
  reducers: {
      updateDocument: (state, action) => {
          const { type, url } = action.payload;
          state[type] = url;
      },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchDocumentThunk.fulfilled,
      (state, action) => {
        return {...state, ...action.payload}
      },
    );
  },
});

// Export actions
export const {
  updateDocument,
} = documentSlice.actions;

// Export reducer
export default documentSlice.reducer;