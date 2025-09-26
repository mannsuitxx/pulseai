import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
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

  // Forgot password state
  const [forgotPasswordStep, setForgotPasswordStep] = useState(null); // null, 'email', 'otp'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  const handleRequestPasswordResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/request_password_reset_otp', { email });
      setOtpSentMessage(response.data.message);
      setForgotPasswordStep('otp');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleResetPasswordWithOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/reset_password_with_otp', { email, otp, new_password: newPassword });
      setOtpSentMessage(response.data.message);
      setForgotPasswordStep(null);
      setOtpStep(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    }
    setLoading(false);
  };

  const renderForgotPassword = () => {
    if (forgotPasswordStep === 'email') {
      return (
        <Box component="form" onSubmit={handleRequestPasswordResetOtp} sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>Forgot Password</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send OTP
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setForgotPasswordStep(null)}
            sx={{ mb: 2 }}
          >
            Back to Login
          </Button>
        </Box>
      );
    }

    if (forgotPasswordStep === 'otp') {
      return (
        <Box component="form" onSubmit={handleResetPasswordWithOtp} sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>Reset Password</Typography>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New Password"
            type="password"
            id="new_password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            Reset Password
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setForgotPasswordStep('email')}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        </Box>
      );
    }

    return null;
  }

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

          {forgotPasswordStep ? renderForgotPassword() : (
            <>
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
                  <Typography variant="body2" align="center">
                    <Link to="#" onClick={() => setForgotPasswordStep('email')} style={{ color: '#3B82F6' }}>
                      Forgot Password?
                    </Link>
                  </Typography>
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
              <Typography variant="body2" align="center" color="#333333" sx={{ mt: 2 }}>
                Not a member? <Link to="/signup" style={{ color: '#3B82F6' }}>Register</Link>
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
