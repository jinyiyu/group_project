import { createSlice } from '@reduxjs/toolkit';
import { fetchDocumentThunk } from './documentThunk';

const initialState = {
  "profilePicture": {
    url: "",
    file: null,
  },
  "licenseCopy": {
    url: "",
    file: null,
  },
  "OPT_receipt": {
    url: "",
    file: null,
  },
  "OPT_EAD": {
    url: "",
    file: null,
  },
  "I_983": {
    url: "",
    file: null,
  },
  "I_20": {
    url: "",
    file: null,
  },
}

const documentSlice = createSlice({
  name: 'document',
  initialState: initialState,
  reducers: {
      updateDocument: (state, action) => {
          let { type, url, file } = action.payload;
          if (type.includes(".")) {
            type = type.split('.').pop();
          }
          state[type]["url"] = url;
          state[type]["file"] = file;
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