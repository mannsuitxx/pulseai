import React, { useState } from 'react';
import api from '../api'; // Import the centralized API
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Alert, // Import Alert for error messages
    FormControl, // Import FormControl
    RadioGroup, // Import RadioGroup
    FormControlLabel, // Import FormControlLabel
    Radio // Import Radio
} from '@mui/material';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(''); // New state for OTP
    const [role, setRole] = useState('student'); // New state for role, default to student
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/request_signup_otp', { email, username });
            setStep(2); // Move to OTP verification step
            alert('OTP sent to your email!');
        } catch (err) {
            console.error('Error requesting OTP:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to request OTP. Please try again.');
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/verify_signup_otp', { username, password, full_name: fullName, email, otp, role }); // Pass role to backend
            alert('Signup successful!');
            navigate('/login');
        } catch (err) {
            console.error('Error verifying OTP:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to verify OTP. Please try again.');
            }
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ my: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom color="#333333">
                        Sign Up
                    </Typography>
                    {step === 1 && (
                        <Box component="form" onSubmit={handleRequestOtp} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoComplete="name"
                                autoFocus
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    setError('');
                                }}
                                variant="outlined" // Ensure outlined variant for styling
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                variant="outlined" // Ensure outlined variant for styling
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError('');
                                }}
                                variant="outlined" // Ensure outlined variant for styling
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                variant="outlined" // Ensure outlined variant for styling
                            />
                            <FormControl component="fieldset" margin="normal" fullWidth>
                                <Typography variant="subtitle1" gutterBottom color="#333333">Select Role:</Typography>
                                <RadioGroup
                                    row
                                    aria-label="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <FormControlLabel value="student" control={<Radio />} label={<Typography color="#333333">Student</Typography>} />
                                    <FormControlLabel value="teacher" control={<Radio />} label={<Typography color="#333333">Teacher</Typography>} />
                                </RadioGroup>
                            </FormControl>
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                color="primary" // Use brand's light blue background
                            >
                                Request OTP
                            </Button>
                        </Box>
                    )}
                    {step === 2 && (
                        <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 1 }}>
                            <Typography variant="body1" sx={{ mb: 2 }} color="#333333">
                                An OTP has been sent to your email ({email}). Please enter it below to complete signup.
                            </Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="otp"
                                label="OTP"
                                name="otp"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    setError('');
                                }}
                                variant="outlined" // Ensure outlined variant for styling
                            />
                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                color="primary" // Use brand's light blue background
                            >
                                Verify OTP & Sign Up
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setStep(1)} // Go back to request OTP step
                                sx={{ mb: 2 }}
                                color="secondary" // Use light gray background
                            >
                                Back
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default Signup;
