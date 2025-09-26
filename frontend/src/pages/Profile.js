import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../api'; // Import the centralized API
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button, // Import Button
    Avatar // Import Avatar for PFP display
} from '@mui/material';


const Profile = () => {
    const { token, user } = useAuth(); // Get user from AuthContext
    const [selectedFile, setSelectedFile] = useState(null); // State for selected PFP file

    // User data should ideally come from the 'user' object in AuthContext
    // For now, we'll still decode from token for robustness, but prefer 'user'
    let username = user?.username || '';
    let role = user?.role || '';
    let fullName = user?.full_name || '';
    let email = user?.email || '';
    let pfpUrl = user?.pfp_url ? `${API_URL}/uploads/profile_pics/${user.pfp_url}` : ''; // Construct full URL using new route

    console.log("User object from AuthContext:", user);
    console.log("Constructed PFP URL:", pfpUrl);

    // Fallback to decoding token if user object is not fully populated (e.g., on initial load)
    if (!user && token) {
        try {
            const decodedToken = jwtDecode(token);
            username = decodedToken.username;
            role = decodedToken.role;
            // Note: full_name, email, pfp_url won't be in old tokens, only new ones
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePfpUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('pfp', selectedFile);

        try {
            const response = await api.post('/upload_pfp', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data.message);
            // Optionally, refresh user data in AuthContext or page to show new PFP
            // For now, user would need to re-login or refresh page to see new PFP
            console.log(response.data.pfp_url);
        } catch (error) {
            console.error('Error uploading PFP:', error);
            alert('Error uploading PFP: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom color="#333333">
                        Profile
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar src={pfpUrl} sx={{ width: 100, height: 100, mb: 2 }} />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="pfp-upload-button"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="pfp-upload-button">
                            <Button variant="outlined" component="span" color="secondary">
                                Select Profile Picture
                            </Button>
                        </label>
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mt: 1 }} color="#333333">
                                {selectedFile.name} selected
                            </Typography>
                        )}
                        <Button variant="contained" onClick={handlePfpUpload} disabled={!selectedFile} sx={{ mt: 2 }} color="primary">
                            Upload Profile Picture
                        </Button>
                    </Box>
                    <Typography variant="h6" color="#333333">
                        Full Name: {fullName}
                    </Typography>
                    <Typography variant="h6" color="#333333">
                        Email: {email}
                    </Typography>
                    <Typography variant="h6" color="#333333">
                        Username: {username}
                    </Typography>
                    <Typography variant="h6" color="#333333">
                        Role: {role}
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Profile;