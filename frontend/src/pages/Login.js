
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';

function Login() {
  const [username_or_email, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // New state for OTP step
  const [otpSentMessage, setOtpSentMessage] = useState(''); // Message after OTP is sent
  const { login, verifyOtp } = useAuth(); // Destructure verifyOtp
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(username_or_email, password);
      setOtpSentMessage(response.message); // Display message from backend
      setOtpStep(true); // Move to OTP step
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    }
    setLoading(false);
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp(username_or_email, otp);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ my: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="#333333">
            Login
          </Typography>
          {otpSentMessage && (
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              {otpSentMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {!otpStep ? (
            <Box component="form" onSubmit={handlePasswordLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username_or_email"
                label="Username or Email"
                name="username_or_email"
                autoComplete="username"
                autoFocus
                value={username_or_email}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                color="primary"
              >
                Sign In
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleOtpVerification} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                color="primary"
              >
                Verify OTP
              </Button>
            </Box>
          )}
          <Typography variant="body2" align="center" color="#333333">
            Not a member? <Link to="/signup" style={{ color: '#3B82F6' }}>Register</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
