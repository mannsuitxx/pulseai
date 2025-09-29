import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../api';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
    Avatar,
    TextField,
    IconButton,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Profile.css';

const Profile = () => {
    const { token, user, setUser } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [pfpUrl, setPfpUrl] = useState(user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : '');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFullName(user?.full_name || '');
        setEmail(user?.email || '');
        setPfpUrl(user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : '');
    }, [user]);

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        setError('');
        setSuccess('');
    };

    const handleUpdateProfile = async () => {
        if (email !== user.email) {
            if (!otp) {
                setError("Please enter the OTP sent to your new email address.");
                return;
            }
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                full_name: fullName,
                email: email,
                otp: email !== user.email ? otp : undefined
            };
            const response = await api.put('/update_profile', payload, {
                headers: { 'x-access-token': token }
            });
            setUser(response.data.user);
            setSuccess('Profile updated successfully!');
            setIsEditMode(false);
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating the profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEmailOtp = async () => {
        if (!email) {
            setError("Email field cannot be empty.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/request_email_change_otp', { new_email: email }, {
                headers: { 'x-access-token': token }
            });
            setSuccess('An OTP has been sent to your new email address.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (!otp) {
            setError("Please enter the OTP sent to your email.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                current_password: password,
                new_password: newPassword,
                otp: otp
            };
            const response = await api.post('/change_password', payload, {
                headers: { 'x-access-token': token }
            });
            setSuccess(response.data.message);
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while changing the password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestPasswordOtp = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/request_password_change_otp', {}, {
                headers: { 'x-access-token': token }
            });
            setSuccess('An OTP has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <Paper elevation={3} sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Profile
                    </Typography>
                    
                    {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
                    {success && <Typography color="primary" align="center" sx={{ mb: 2 }}>{success}</Typography>}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar src={pfpUrl} sx={{ width: 120, height: 120, mb: 2, border: '2px solid #1976d2' }} />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={!isEditMode}
                            variant={isEditMode ? "outlined" : "filled"}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditMode}
                            variant={isEditMode ? "outlined" : "filled"}
                            sx={{ mb: 2 }}
                        />
                        {isEditMode && email !== user.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <TextField
                                    label="OTP for Email Change"
                                    fullWidth
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Button onClick={handleRequestEmailOtp} variant="contained" disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : 'Get OTP'}
                                </Button>
                            </Box>
                        )}
                        <TextField label="Username" fullWidth value={user?.username || ''} disabled variant="filled" sx={{ mb: 2 }} />
                        <TextField label="Role" fullWidth value={user?.role || ''} disabled variant="filled" />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {isEditMode ? (
                            <>
                                <Button variant="outlined" onClick={handleEditToggle}>Cancel</Button>
                                <Button variant="contained" onClick={handleUpdateProfile} disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : 'Save'}
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={handleEditToggle}>Edit Profile</Button>
                        )}
                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Change Password
                    </Typography>
                    <TextField
                        label="Current Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <TextField
                            label="OTP"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button onClick={handleRequestPasswordOtp} variant="contained" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Get OTP'}
                        </Button>
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={loading} fullWidth>
                        {loading ? <CircularProgress size={24} /> : 'Change Password'}
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
