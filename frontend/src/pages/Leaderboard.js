import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the centralized API
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/leaderboard/leaderboard');
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Leaderboard
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell color="#333333">Rank</TableCell>
                                <TableCell color="#333333">Username</TableCell>
                                <TableCell color="#333333">High Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaderboard.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell color="#333333">{index + 1}</TableCell>
                                    <TableCell color="#333333">{user.username}</TableCell>
                                    <TableCell color="#333333">{user.high_score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default Leaderboard;