import React, { useState, useEffect, useRef } from 'react';
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
    CircularProgress,
    Collapse,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import './Profile.css';

const Profile = () => {
    const { token, user, setUser } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Editable fields
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.username || '');
    const [pfpUrl, setPfpUrl] = useState(user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : '');
    const [selectedFile, setSelectedFile] = useState(null);

    // Password change fields
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP and status fields
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        setFullName(user?.full_name || '');
        setEmail(user?.email || '');
        setUsername(user?.username || '');
        setPfpUrl(user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : '');
    }, [user]);

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        setError('');
        setSuccess('');
        setShowChangePassword(false);
        setOtpSent(false);
        setOtp('');
        if (isEditMode) {
            setFullName(user?.full_name || '');
            setEmail(user?.email || '');
            setUsername(user?.username || '');
            setSelectedFile(null);
            setPfpUrl(user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : '');
        }
    };

    const handlePfpClick = () => {
        if (isEditMode) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPfpUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async () => {
        if (fullName === user.full_name && email === user.email && username === user.username && !selectedFile) {
            setIsEditMode(false);
            return;
        }

        if ((email !== user.email || username !== user.username) && !otpSent) {
            await handleRequestUpdateOtp();
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('pfp', selectedFile);
                await api.post('/upload_pfp', formData, {
                    headers: { 'x-access-token': token, 'Content-Type': 'multipart/form-data' }
                });
            }

            const payload = {
                full_name: fullName,
                email: email,
                username: username,
                otp: otp || undefined
            };
            const response = await api.put('/update_profile', payload, {
                headers: { 'x-access-token': token }
            });
            setUser(response.data.user);
            setSuccess('Profile updated successfully!');
            setIsEditMode(false);
            setOtp('');
            setOtpSent(false);
            setSelectedFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while updating the profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestUpdateOtp = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/request_update_otp', { new_email: email, new_username: username }, {
                headers: { 'x-access-token': token }
            });
            setSuccess('An OTP has been sent to your email address. Please enter it to save your changes.');
            setOtpSent(true);
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
        
        if (!otpSent) {
            await handleRequestPasswordOtp();
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
            setOtpSent(false);
            setShowChangePassword(false);
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
            setSuccess('An OTP has been sent to your email. Please enter it to change your password.');
            setOtpSent(true);
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
                        Profile Settings
                    </Typography>
                    
                    {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
                    {success && <Typography color="success.main" align="center" sx={{ mb: 2 }}>{success}</Typography>}

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar src={pfpUrl} sx={{ width: 120, height: 120, mb: 2, border: '2px solid #1976d2', cursor: isEditMode ? 'pointer' : 'default' }} onClick={handlePfpClick} />
                            {isEditMode && <IconButton sx={{ position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)' }} onClick={handlePfpClick}><Edit /></IconButton>}
                        </Box>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <TextField label="Full Name" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isEditMode} variant={isEditMode ? "outlined" : "filled"} sx={{ mb: 2 }} />
                        <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditMode} variant={isEditMode ? "outlined" : "filled"} sx={{ mb: 2 }} />
                        <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} disabled={!isEditMode} variant={isEditMode ? "outlined" : "filled"} sx={{ mb: 2 }} />
                        <TextField label="Role" fullWidth value={user?.role || ''} disabled variant="filled" />
                    </Box>

                    <Collapse in={isEditMode && (email !== user.email || username !== user.username)}>
                        <Box sx={{ my: 2 }}>
                            <TextField label="Enter OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </Box>
                    </Collapse>

                    <Collapse in={isEditMode}>
                        <Box sx={{ my: 2 }}>
                            <Button variant="outlined" onClick={() => setShowChangePassword(!showChangePassword)}>
                                Change Password
                            </Button>
                            <Collapse in={showChangePassword}>
                                <Box sx={{ mt: 2 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h5" component="h2" gutterBottom>Change Password</Typography>
                                    <TextField label="Current Password" type={showPassword ? 'text' : 'password'} fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />
                                    <TextField label="New Password" type={showNewPassword ? 'text' : 'password'} fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end"> {showNewPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />
                                    <TextField label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'} fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 2 }} InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end"> {showConfirmPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ), }} />
                                    <Collapse in={otpSent && showChangePassword}>
                                        <TextField label="Enter OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ my: 2 }} />
                                    </Collapse>
                                    <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={loading} fullWidth>
                                        {loading ? <CircularProgress size={24} /> : (otpSent ? 'Confirm Change' : 'Change Password')}
                                    </Button>
                                </Box>
                            </Collapse>
                        </Box>
                    </Collapse>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        {isEditMode ? (
                            <>
                                <Button variant="outlined" onClick={handleEditToggle}>Cancel</Button>
                                <Button variant="contained" onClick={handleUpdateProfile} disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={handleEditToggle}>Edit Profile</Button>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;
