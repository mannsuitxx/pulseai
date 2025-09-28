import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the centralized API
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

const DisasterAnalysis = () => {
    const [location, setLocation] = useState('');
    const [disasterType, setDisasterType] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [dailyReports, setDailyReports] = useState([]); // New state for daily reports
    const [timeLeft, setTimeLeft] = useState(0); // New state for countdown timer
    const [analysisHistory, setAnalysisHistory] = useState([]); // New state for analysis history
    const { token, user } = useAuth(); // Get user for admin check

    useEffect(() => {
        fetchDailyReports();
        fetchAnalysisHistory(); // Fetch analysis history on component mount
    }, [token, fetchDailyReports, fetchAnalysisHistory]); // Fetch daily reports and analysis history on component mount or token change

    const fetchAnalysisHistory = async () => {
        try {
            const response = await api.get('/get_analysis_history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalysisHistory(response.data);
        } catch (error) {
            console.error('Error fetching analysis history:', error);
        }
    };

    useEffect(() => {
        let timer;
        if (analysisResult) {
            setTimeLeft(30); // Start countdown from 30 seconds
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setAnalysisResult(''); // Clear analysis when timer runs out
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [analysisResult]);

    const fetchDailyReports = async () => {
        try {
            const response = await api.get('/get_daily_reports', {
                headers: { 'x-access-token': token }
            });
            setDailyReports(response.data);
        } catch (error) {
            console.error('Error fetching daily reports:', error);
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysisResult('');
        try {
            const response = await api.post('/disaster_analysis', {
                location,
                disaster_type: disasterType
            }, {
                headers: { 'x-access-token': token }
            });
            const analysisId = response.data.analysis_id;
            setCurrentAnalysisId(analysisId); // Store the analysis ID
            
            // Fetch the actual analysis content using the analysisId
            const analysisResponse = await api.get(`/get_temporary_analysis/${analysisId}`, {
                headers: { 'x-access-token': token }
            });
            setAnalysisResult(analysisResponse.data.analysis);

            // Automatically trigger download using a more reliable method
            if (analysisId) {
                try {
                    const downloadResponse = await api.get(`/download_analysis/${analysisId}`, {
                        headers: { 'x-access-token': token },
                        responseType: 'blob' // Important: responseType must be 'blob'
                    });

                    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `disaster_analysis_${analysisId}.txt`); // Set the download filename
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link); // Clean up the DOM
                    window.URL.revokeObjectURL(url); // Free up memory

                } catch (downloadError) {
                    console.error('Error automatically downloading analysis:', downloadError);
                    alert('Failed to automatically download analysis. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error fetching disaster analysis:', error);
            setAnalysisResult('Failed to fetch analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateDailyReport = async () => {
        try {
            const response = await api.post('/generate_daily_report', {
                location: location || 'India', // Use current location or default
                disaster_type: disasterType || ''
            }, {
                headers: { 'x-access-token': token }
            });
            alert(response.data.message);
            fetchDailyReports(); // Refresh reports after generation
        } catch (error) {
            console.error('Error generating daily report:', error);
            alert('Error generating daily report: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteReport = async (reportId) => {
        try {
            await api.delete(`/delete_daily_report/${reportId}`, {
                headers: { 'x-access-token': token }
            });
            alert('Report deleted successfully!');
            fetchDailyReports(); // Refresh reports after deletion
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Error deleting report: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Disaster Analysis
                </Typography>
                <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location (e.g., Punjab, India)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        variant="outlined" // Ensure outlined variant for styling
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Disaster Type (optional, e.g., Flood, Earthquake)"
                        value={disasterType}
                        onChange={(e) => setDisasterType(e.target.value)}
                        variant="outlined" // Ensure outlined variant for styling
                    />
                    <Button
                        variant="contained"
                        onClick={handleAnalyze}
                        disabled={loading || !location}
                        sx={{ mt: 2 }}
                        color="primary"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Get Analysis'}
                    </Button>

                    {analysisResult && (
                        <Paper sx={{ mt: 4, p: 2 }}>
                            <Typography variant="h6" component="h2" gutterBottom color="#333333">
                                Analysis Result:
                            </Typography>
                            <Typography variant="body2" color="#666666" sx={{ mb: 2 }}>
                                This analysis will disappear in {timeLeft} seconds.
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }} color="#333333">
                                <ReactMarkdown>
                                    {analysisResult}
                                </ReactMarkdown>
                            </Typography>
                        </Paper>
                    )}

                    {user && user.role === 'admin' && ( // Show generate button for admin
                        <Button
                            variant="outlined"
                            onClick={handleGenerateDailyReport}
                            sx={{ mt: 2 }}
                            color="primary"
                        >
                            Generate Daily Report (Admin)
                        </Button>
                    )}
                </Paper>

                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                        Past Daily Reports
                    </Typography>
                    {dailyReports.length > 0 ? (
                        dailyReports.map(report => (
                            <Card key={report._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }} color="#333333"> {/* Stronger header */}
                                        {report.title || `${report.location} - ${report.disaster_type || 'General'} Disaster Report`} {/* Use generated title or fallback */}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }} color="#333333"> {/* More margin */}
                                        Date: {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                    <Typography variant="body1" component={'div'} color="#333333"> {/* Use component='div' for ReactMarkdown */}
                                        <ReactMarkdown>
                                            {report.report}
                                        </ReactMarkdown>
                                    </Typography>
                                    {user && user.role === 'admin' && ( // Show delete button for admin
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleDeleteReport(report._id)}
                                            sx={{ mt: 2 }}
                                            color="secondary"
                                        >
                                            Delete Report
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1" color="#333333">No daily reports available.</Typography>
                    )}
                </Box>

                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                        Your Analysis History
                    </Typography>
                    {analysisHistory.length > 0 ? (
                        analysisHistory.map(entry => (
                            <Card key={entry._id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }} color="#333333">
                                        {entry.location} - {entry.disaster_type || 'General'}
                                    </Typography>
                                    <Typography variant="body2" color="#333333">
                                        Generated: {new Date(entry.generated_at).toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body1" color="#333333">No analysis history available.</Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default DisasterAnalysis;
