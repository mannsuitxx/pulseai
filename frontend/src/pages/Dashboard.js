
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Modal,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ games_played: 0, high_score: 0 });
    const { token, user } = useAuth(); // Get user from AuthContext
    const [liveDemos, setLiveDemos] = useState([]);
    const [selectedDemo, setSelectedDemo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stats/stats', {
                    headers: { 'x-access-token': token }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const fetchLiveDemos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/live-demos-public');
                setLiveDemos(response.data);
            } catch (error) {
                console.error('Error fetching live demos:', error);
            }
        };

        if (token) {
            fetchStats();
            fetchLiveDemos();
        }
    }, [token]);

    const handleWatchDemo = async (demo) => {
        setSelectedDemo(demo);
        setModalOpen(true);

        // Award points for watching the demo
        try {
            const response = await axios.post('http://localhost:5000/game/watch-demo-points', {
                demo_id: demo._id
            }, {
                headers: token ? { 'x-access-token': token } : {}
            });
            console.log(response.data.message);
            // Optionally, show a toast notification or update user's score display
        } catch (error) {
            console.error('Error awarding points for watching demo:', error);
        }
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
        <Container maxWidth="lg">
            <Box sx={{ my: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Welcome, {user ? user.username : 'Guest'}!
                </Typography>
                <Typography variant="h6" component="p" sx={{ mb: 4 }} color="#FFFFFF">
                    Here's a summary of your progress and quick actions.
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" color="#333333">
                                    Games Played
                                </Typography>
                                <Typography variant="h2" component="div" color="#333333">
                                    {stats.games_played}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" color="#333333">
                                    High Score
                                </Typography>
                                <Typography variant="h2" component="div" color="#333333">
                                    {stats.high_score}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom color="#333333">
                                    Quick Actions
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button variant="contained" component={Link} to="/games" color="primary">
                                        Play a Game
                                    </Button>
                                    <Button variant="outlined" component={Link} to="/drills" color="secondary">
                                        Start a Virtual Drill
                                    </Button>
                                    <Button variant="outlined" component={Link} to="/emergency" color="secondary">
                                        Emergency Info
                                    </Button>
                                    <Button variant="outlined" component={Link} to="/leaderboard" color="secondary">
                                        View Leaderboard
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Live Demos Section */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom color="#333333">
                                    Live Demos
                                </Typography>
                                <Grid container spacing={2}>
                                    {liveDemos.length > 0 ? (
                                        liveDemos.map((demo) => (
                                            <Grid item key={demo._id} xs={12} sm={6} md={4}>
                                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography gutterBottom variant="h6" component="h3" color="#333333">
                                                            {demo.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="#333333">
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
                                        ))
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant="body1" color="#333333" sx={{ ml: 2 }}>
                                                No live demos available yet.
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* YouTube Video Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="youtube-modal-title"
                aria-describedby="youtube-modal-description"
            >
                <Box sx={{
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
                }}>
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
                            <Typography id="youtube-modal-title" variant="h6" component="h2" sx={{ mt: 2 }} color="#333333">
                                {selectedDemo.title}
                            </Typography>
                            <Typography id="youtube-modal-description" sx={{ mt: 2 }} color="#333333">
                                {selectedDemo.description}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default Dashboard;
