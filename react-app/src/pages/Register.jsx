// src/components/Register.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { validateRegister, registerUser } from "../store/authSlice/authSlice.js";

const Register = () => {
  const { token } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hieu Tran add on
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const dispatch = useDispatch();

  const {
    loading,
    error,
    accessTokenValid,
    email,
    registerSuccess,
    isAuthenticated,
    user,
  } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (token) {
      dispatch(validateRegister(token));
    }
  }, [dispatch, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const userData = {
      username,
      password,
      confirmPassword,
    };

    dispatch(registerUser({ token, userData }));
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "hr") {
        window.location.href = "http://localhost:5173/generateTokenForm";
      } else if (user.role === "employee") {
        window.location.href = "http://localhost:5173/onboarding";
      }
    }
  }, [isAuthenticated, user]);

  // Display a message when registration is successful
  useEffect(() => {
    if (registerSuccess) {
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.href = "http://localhost:5173/";
      }, 3000);
    }
  }, [registerSuccess]);

  // Display error messages from API or form validation
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [error]);

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      {/* If token is invalid or expired */}
      {accessTokenValid === false && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          Invalid or expired token.
        </Alert>
      )}

      {/* If registration was successful */}
      {registerSuccess && (
        <Alert severity="success" style={{ marginBottom: "20px" }}>
          Registration successful!
        </Alert>
      )}

      {/* Error notification */}
      {error && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Loading spinner when the request is in progress */}
      {loading && (
        <CircularProgress style={{ marginBottom: "20px", display: "block" }} />
      )}

      {/* Registration form */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="text"
          label="Username"
          variant="outlined"
          margin="normal"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="text"
          variant="outlined"
          margin="normal"
          value={email || ""}
          disabled
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          value={confirmPassword || ""}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </form>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
