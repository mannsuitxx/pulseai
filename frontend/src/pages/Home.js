
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Grid, // Import Grid
    Card, // Import Card
    CardContent, // Import CardContent
    CardActions // Import CardActions
} from '@mui/material';
import { styled } from '@mui/system'; // Import styled

// Import Icons (example, choose relevant ones)
import WarningIcon from '@mui/icons-material/Warning';
import GamesIcon from '@mui/icons-material/Games';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SecurityIcon from '@mui/icons-material/Security';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(5px)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.shape.borderRadius,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const Home = () => {
    const { user } = useAuth(); // Get user from auth context

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 8, textAlign: 'center', color: '#FFFFFF' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                    Welcome to PulseAI: Your Shield in the Storm
                </Typography>
                <Typography variant="h5" component="p" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                    In a world of uncertainties, PulseAI stands as your proactive partner in disaster preparedness and community resilience. We blend cutting-edge AI with intuitive tools to empower you, your family, and your community to face emergencies with confidence.
                </Typography>

                <Box sx={{ my: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                        What We Offer
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <StyledCard>
                                <CardContent>
                                    <WarningIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        Emergency Management
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Real-time alerts, critical information, and communication tools to navigate any crisis.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button size="small" component={Link} to="/emergency">Learn More</Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StyledCard>
                                <CardContent>
                                    <GamesIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        Engaging Drills & Games
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Prepare for the unexpected through interactive simulations and educational games.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button size="small" component={Link} to="/games">Play Now</Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StyledCard>
                                <CardContent>
                                    <AnalyticsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        Disaster Analysis
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Understand risks and trends with AI-powered insights and historical data.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button size="small" component={Link} to="/disaster-analysis">Explore Data</Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StyledCard>
                                <CardContent>
                                    <SecurityIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        Community Resilience
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Foster a safer environment through shared knowledge and collective action.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button size="small" component={Link} to="/dashboard">Join Community</Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    </Grid>
                </Box>

                {!user && ( // Conditionally render buttons if user is not logged in
                    <Paper sx={{ p: 4, mt: 8, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)' }}>
                        <Typography variant="h5" component="h2" gutterBottom color="#333333">
                            Ready to enhance your safety?
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Join PulseAI today and become part of a community dedicated to preparedness.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                            <Button variant="contained" color="primary" component={Link} to="/login" size="large">
                                Login
                            </Button>
                            <Button variant="contained" color="secondary" component={Link} to="/signup" size="large">
                                Sign Up
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default Home;
