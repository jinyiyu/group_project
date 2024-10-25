import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = "http://localhost:3000";

export const fetchDocumentThunk = createAsyncThunk('document/fetchDocument', async () => {
  const res = await fetch(
    `${BASE_URL}/document/fetchUrls`, 
    {
      method: 'GET',
      credentials: "include",
    });

  if (!res.ok) {
      throw new Error('error fetching documents');
  }

  const {files} = await res.json();

  return files;
});

