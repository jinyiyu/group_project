// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const host = "http://localhost:3000";

export const validateRegister = createAsyncThunk(
  "auth/validateRegister",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${host}/user/validateRegister/${token}`
      );
      console.log("response: ", response.data);
      return response.data; // Assumes the API returns email if valid
    } catch (error) {
      let message =
        error.response?.data?.message || "Invalid link or link expired";
      return rejectWithValue(message);
    }
  }
);

export const getUserOnboardStatus = createAsyncThunk(
  "auth/getUserOnboardStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${host}/user/onboardStatus`,
        { withCredentials: true }
      );
      return response.data; // Assumes the API returns email if valid
    } catch (error) {
      let message = error.response?.data?.message || "Invalid link or link expired";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${host}/user/register/${token}`,
        userData,
        { withCredentials: true }
      );
      return response.data; // Assumes the API returns a success message
    } catch (error) {
      let message = error.response?.data?.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${host}/user/login`,
        { username, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      let message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const checkLoginStatus = createAsyncThunk(
  "auth/checkLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/user/isLoggedIn",
        { withCredentials: true }
      );
      // console.log("response: :", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Not logged in");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/user/logout", {
        withCredentials: true,
      });
      // return {};
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null, // Stores email if token is valid
    accessTokenValid: false, // Tracks if url token for register is valid
    registerSuccess: false, // Tracks if registration is successful
    isAuthenticated: false,
    loading: false, // Loading state for token validation, registration, and login
    error: null, // Error message if something goes wrong
    onboardStatus: null,
    user: null, // Stores user information after login
    loginSuccess: true, // Tracks if login is successful
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register Token Validation
      .addCase(validateRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.accessTokenValid = true;
      })
      .addCase(validateRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.accessTokenValid = false;
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user ? action.payload.user : action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Check Login Status
      .addCase(checkLoginStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // console.log("User from action payload:", action.payload);
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // onboarding status
      .addCase(getUserOnboardStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(getUserOnboardStatus.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("onboardStatus::", action.payload.onboardStatus);
        state.onboardStatus = action.payload.onboardStatus;
      }
      )
      .addCase(getUserOnboardStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
      }
      )

      // // Logout User
      // .addCase(logoutUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(logoutUser.fulfilled, async (state) => {
      //   state.loading = false;
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.error = null;
      // })
      // .addCase(logoutUser.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // });

        // Handle user logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },

});

export default authSlice.reducer;

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     email: null, // Stores email if token is valid
//     accessTokenValid: false, // Tracks if url token for register is valid
//     registerSuccess: false, // Tracks if registration is successful
//     isAuthenticated: false,
//     loading: false, // Loading state for token validation, registration, and login
//     error: null, // Error message if something goes wrong

//     user: null, // Stores user information after login
//     loginSuccess: false, // Tracks if login is successful
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     // Handle token validation
//     builder
//       .addCase(validateRegister.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(validateRegister.fulfilled, (state, action) => {
//         // console.log("Action Payload::", action.payload);

//         state.loading = false;
//         state.email = action.payload.email;
//         state.accessTokenValid = true;
//         // console.log("email::", state.email);
//         // console.log("tokenvalid::", state.accessTokenValid);
//       })
//       .addCase(validateRegister.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.accessTokenValid = false;
//         console.log("error::", state.error);
//       });

//     // Handle user registration
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.registerSuccess = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.registerSuccess = false;
//       });

//     // Handle user login
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.loginSuccess = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.loginSuccess = false;
//       });

//     // Handle checking login status
//     builder
//       .addCase(checkLoginStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(checkLoginStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.loginSuccess = true;
//       })
//       .addCase(checkLoginStatus.rejected, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.loginSuccess = false;
//       });

//     // Handle user logout
//     builder
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.loginSuccess = false;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });
