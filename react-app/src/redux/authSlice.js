// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const host = 'http://localhost:3000';

// Async action to validate registration token
export const validateRegister = createAsyncThunk(
  'auth/validateRegister',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${host}/user/validateRegister/${token}`);
      console.log("response::", response);
      return response.data;  // Assumes the API returns email if valid
    } catch (error) {
      let message = error.response?.data?.message || 'Invalid link or link expired';
      return rejectWithValue(message);
    }
  }
);

// Async action for registering a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${host}/user/register/${token}`, userData);
      return response.data;  // Assumes the API returns a success message
    } catch (error) {
      let message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Async action for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${host}/user/login`, { username, password });
      return response.data;  // Assumes the API returns a success message and possibly user info
    } catch (error) {
      let message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: null,          // Stores email if token is valid
    tokenValid: false,    // Tracks if token is valid
    loading: false,       // Loading state for token validation, registration, and login
    error: null,          // Error message if something goes wrong
    registerSuccess: false,  // Tracks if registration is successful
    user: null,           // Stores user information after login
    loginSuccess: false,   // Tracks if login is successful
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle token validation
    builder
      .addCase(validateRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.tokenValid = true;
      })
      .addCase(validateRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tokenValid = false;
      });

    // Handle user registration
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      });

    // Handle user login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; 
        state.loginSuccess = true; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
        state.loginSuccess = false; 
      });
  },
});

export default authSlice.reducer;
