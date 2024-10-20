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
      throw new Error('Network response was not ok');
  }

  const {files} = await res.json();
  const documents = {
    "profilePicture": {
      url: files["profilePicture"],
      file: null,
    },
    "licenseCopy": {
      url: files["licenseCopy"],
      file: null,
    },
    "OPT_receipt": {
      url: files["OPT_receipt"],
      file: null,
    },
    "OPT_EAD": {
      url: files["OPT_EAD"],
      file: null,
    },
    "I_983": {
      url: files["I_983"],
      file: null,
    },
    "I_20": {
      url: files["I_20"],
      file: null,
    },
  }
  return documents;
});

