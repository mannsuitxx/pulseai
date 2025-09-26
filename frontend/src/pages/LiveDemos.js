import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the centralized API
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Modal,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

const LiveDemos = () => {
    const [liveDemos, setLiveDemos] = useState([]);
    const [selectedDemo, setSelectedDemo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchLiveDemos = async () => {
        try {
            // Assuming a public endpoint for fetching live demos for users
            // If authentication is required, adjust this or create a public endpoint
            const response = await api.get('/admin/live-demos'); 
            setLiveDemos(response.data);
        } catch (error) {
            console.error('Error fetching live demos:', error);
        }
    };

    useEffect(() => {
        fetchLiveDemos();
    }, []);

    const handleWatchDemo = (demo) => {
        setSelectedDemo(demo);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDemo(null);
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                Live Demos
            </Typography>

            <Grid container spacing={4}>
                {liveDemos.map((demo) => (
                    <Grid item key={demo._id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {demo.title}
                                </Typography>
                                <Typography>
                                    {demo.description}
                                </Typography>
                            </CardContent>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleWatchDemo(demo)}
                                sx={{ m: 2 }}
                            >
                                Watch Demo
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedDemo && (
                        <>
                            <iframe
                                width="100%"
                                height="315"
                                src={getYouTubeEmbedUrl(selectedDemo.youtube_link)}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube video player"
                            ></iframe>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
                                {selectedDemo.title}
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                {selectedDemo.description}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default LiveDemos;
