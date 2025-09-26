import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Tabs,
    Tab
} from '@mui/material';

const Emergency = () => {
    const [resources, setResources] = useState([]);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://localhost:5000/resources');
                setResources(response.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        const fetchEmergencyContacts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/emergency/emergency_contacts');
                setEmergencyContacts(response.data);
            } catch (error) {
                console.error('Error fetching emergency contacts:', error);
            }
        };

        if (tab === 0) {
            fetchResources();
        } else if (tab === 1) {
            fetchEmergencyContacts();
        }
    }, [tab]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Container>
            <Box sx={{ my: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Emergency Information
                </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
                        <Tab label="Emergency Resources" sx={{ color: '#FFFFFF' }} />
                        <Tab label="Emergency Contacts" sx={{ color: '#FFFFFF' }} />
                    </Tabs>
                </Box>

                {tab === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            {resources.map(resource => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={resource._id} sx={{ display: 'flex' }}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h5" component="div" color="#333333">
                                                {resource.name}
                                            </Typography>
                                            <Typography variant="body2" color="#333333">
                                                {resource.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" href={resource.url} target="_blank" rel="noopener noreferrer" color="secondary">
                                                Learn More
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {tab === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            {emergencyContacts.map(contact => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={contact._id} sx={{ display: 'flex' }}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h5" component="div" color="#333333">
                                                {contact.name}
                                            </Typography>
                                            <Typography variant="body2" color="#333333">
                                                Phone: {contact.phone}
                                            </Typography>
                                            <Typography variant="body2" color="#333333">
                                                Type: {contact.contact_type}
                                            </Typography>
                                            <Typography variant="body2" color="#333333">
                                                Location: {contact.location}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Emergency;