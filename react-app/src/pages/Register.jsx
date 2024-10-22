// src/components/Register.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { validateRegister, registerUser } from "../redux/authSlice";

const Register = () => {
  const { token } = useParams(); // Get token from the URL
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error, tokenValid, email, registerSuccess } = useSelector(
    (state) => state.auth,
  );

  // Validate token on component load
  useEffect(() => {
    dispatch(validateRegister(token));
  }, [dispatch, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      username,
      password,
      confirmPassword,
    };

    dispatch(registerUser({ token, userData }));
  };

  // If token is still being validated
  if (loading) {
    return <CircularProgress />;
  }

  // If token is invalid or expired
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // If registration was successful
  if (registerSuccess) {
    return <Alert severity="success">Registration successful!</Alert>;
  }

  // If token is valid, show the registration form
  return tokenValid ? (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Registering for email: {email}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="text"
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          type="text"
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          // inputProps={{readOnly:true}}
          disabled
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
    </Container>
  ) : null;
};

export default Register;
