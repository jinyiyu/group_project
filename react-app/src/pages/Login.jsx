import React, { useState } from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ username, password }));
  };

  return (
    <div>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
    </div>
  );
};

export default Login;
