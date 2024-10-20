import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = "http://localhost:3000";

export const fetchUserThunk = createAsyncThunk('user/fetchUserData', async () => {
  const res = await fetch(
    `${BASE_URL}/user/info`, 
    {
      method: 'GET',
      credentials: "include",
    });

  if (!res.ok) {
      throw new Error('Network response was not ok');
  }

  const {user} = await res.json();
  return user;
});

