
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api'; // Import the centralized API
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Box,
    Grid,
    Paper,
    Alert // Import Alert for feedback
} from '@mui/material';
import { Link } from 'react-router-dom';

const Games = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores selected answer for each question
    const [results, setResults] = useState({}); // Stores correctness for each question
    const [activeCategory, setActiveCategory] = useState('quiz');
    const { token } = useAuth();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // New state for current question
    const [showFeedback, setShowFeedback] = useState(false); // New state to control feedback visibility

    const fetchQuestions = useCallback(async () => {
        try {
            const questionsResponse = await api.get('/game/questions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            let fetchedQuestions = questionsResponse.data;

            let userAnswers = {};
            if (token) {
                const userAnswersResponse = await api.get('/game/user-answers', {
                    headers: { 'x-access-token': token }
                });
                userAnswersResponse.data.forEach(answer => {
                    userAnswers[answer.question_id] = {
                        selected_answer: answer.selected_answer,
                        is_correct: answer.is_correct
                    };
                });
            }

            const initialSelectedAnswers = {};
            const initialResults = {};
            fetchedQuestions.forEach(q => {
                if (userAnswers[q._id]) {
                    initialSelectedAnswers[q._id] = userAnswers[q._id].selected_answer;
                    initialResults[q._id] = userAnswers[q._id].is_correct;
                }
            });

            // Sort questions: unanswered first, then answered
            fetchedQuestions.sort((a, b) => {
                const aAnswered = initialResults.hasOwnProperty(a._id);
                const bAnswered = initialResults.hasOwnProperty(b._id);
                if (aAnswered && !bAnswered) return 1;
                if (!aAnswered && bAnswered) return -1;
                return 0;
            });

            setQuestions(fetchedQuestions);
            setSelectedAnswers(initialSelectedAnswers);
            setResults(initialResults);
            setCurrentQuestionIndex(0); // Reset to first question on fetch
            setShowFeedback(false); // Reset feedback visibility

        } catch (error) {
            console.error('Error fetching questions or user answers:', error);
            alert('Error fetching data: ' + (error.response?.data?.message || error.message));
        }
    }, [token]); // Depend on token to refetch when user logs in/out

    useEffect(() => {
        if (activeCategory === 'quiz') {
            fetchQuestions();
        }
    }, [activeCategory, fetchQuestions]);
    const handleAnswerChange = (questionId, answer) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer
        }));
    };

    const handleSubmitAnswer = async (questionId) => {
        const selectedAnswer = selectedAnswers[questionId];
        if (!selectedAnswer) {
            alert('Please select an answer before submitting.');
            return;
        }

        try {
            const response = await api.post('/game/submit-single', {
                question_id: questionId,
                selected_answer: selectedAnswer
            }, {
                headers: token ? { 'x-access-token': token } : {}
            });
            setResults(prevResults => ({
                ...prevResults,
                [questionId]: response.data.is_correct
            }));
            setShowFeedback(true); // Show feedback after submission

        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Error submitting answer: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleMoveToNextQuestion = () => {
        setShowFeedback(false); // Hide feedback for the next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // All questions answered, quiz completed
            // The 'Quiz Completed!' message will be shown by renderContent
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (results[q._id] === true) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const renderContent = () => {
        switch (activeCategory) {
            case 'quiz':
                const currentQuestion = questions[currentQuestionIndex];
                const quizCompleted = currentQuestionIndex >= questions.length;
                const currentScore = calculateScore();

                if (quizCompleted) {
                    return (
                        <Card sx={{ mt: 4 }}>
                            <CardContent>
                                <Typography variant="h5" component="div" color="#333333">
                                    Quiz Completed! Your Score: {currentScore} / {questions.length}
                                </Typography>
                                <Button variant="contained" onClick={fetchQuestions} sx={{ mt: 2 }} color="primary">
                                    Play Again
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }

                if (!currentQuestion) {
                    return <Typography variant="body1" color="#333333">No questions available or loading...</Typography>;
                }

                const isQuestionAnswered = results.hasOwnProperty(currentQuestion._id);

                return (
                    <Box>
                        <Card key={currentQuestion._id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" color="#333333">{currentQuestion.question}</Typography>
                                <FormControl component="fieldset" sx={{ mt: 1 }}>
                                    <RadioGroup
                                        value={selectedAnswers[currentQuestion._id] || ''}
                                        onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                                    >
                                        {currentQuestion.options.map(option => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio disabled={isQuestionAnswered || showFeedback} />}
                                                label={<Typography color="#333333">{option}</Typography>}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <Box sx={{ mt: 2 }}>
                                    {showFeedback || isQuestionAnswered ? (
                                        <>
                                            <Alert severity={results[currentQuestion._id] ? 'success' : 'error'}>
                                                {results[currentQuestion._id] ? 'Correct!' : `Incorrect. Correct answer: ${currentQuestion.answer}`}
                                            </Alert>
                                            {!quizCompleted && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleMoveToNextQuestion}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Next Question
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSubmitAnswer(currentQuestion._id)}
                                            disabled={!selectedAnswers[currentQuestion._id]}
                                        >
                                            Submit Answer
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                );
            case 'virtual_games':
                return (
                    <Paper sx={{ mt: 4, textAlign: 'center', p: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom color="#333333">
                            Disaster Scenario Visualizer
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }} color="#333333">
                            Engage in an interactive visual simulation of disaster scenarios.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/visual-game"
                        >
                            Play Visual Game
                        </Button>
                    </Paper>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Games
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card
                            onClick={() => setActiveCategory('quiz')}
                            sx={{
                                cursor: 'pointer',
                                border: 'none',
                                boxShadow: activeCategory === 'quiz' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                '&:hover': { boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.5)' }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" component="h2" align="center" color="#333333">
                                    Quiz
                                </Typography>
                                <Typography variant="body2" align="center" color="#333333">
                                    Test your knowledge with interactive quizzes.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card
                            onClick={() => setActiveCategory('virtual_games')}
                            sx={{
                                cursor: 'pointer',
                                border: 'none',
                                boxShadow: activeCategory === 'virtual_games' ? '0px 8px 24px rgba(0, 0, 0, 0.4)' : '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                '&:hover': { boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.5)' }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" component="h2" align="center" color="#333333">
                                    Virtual Games
                                </Typography>
                                <Typography variant="body2" align="center" color="#333333">
                                    Engage in simulated emergency scenarios.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {renderContent()}
            </Box>
        </Container>
    );
};

export default Games;
