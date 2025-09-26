import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Grid,
    Paper
} from '@mui/material';

// Placeholder images - replace with actual images in your public folder or hosted
const IMAGE_PLACEHOLDERS = {
    earthquake_start: '/images/earthquake_start.png',
    safe_cover: '/images/safe_cover.png',
    run_outside: '/images/run_outside.png',
    after_shaking: '/images/after_shaking.png',
    check_hazards: '/images/check_hazards.png',
    gas_leak: '/images/gas_leak.png',
    evacuate_safe: '/images/evacuate_safe.png',
    game_over: '/images/game_over.png',
    choice_drop: '/images/choice_drop.png',
    choice_run: '/images/choice_run.png',
    choice_doorway: '/images/choice_doorway.png',
    choice_check: '/images/choice_check.png',
    choice_ignore: '/images/choice_ignore.png',
    choice_fix: '/images/choice_fix.png',
    choice_evacuate: '/images/choice_evacuate.png',
};

const gameScenarios = {
    "start": {
        text: "You are at home when a strong earthquake begins. The ground is shaking violently. What is your immediate action?",
        image: IMAGE_PLACEHOLDERS.earthquake_start,
        choices: [
            { id: "drop_cover", text: "Drop, Cover, and Hold On", image: IMAGE_PLACEHOLDERS.choice_drop, feedback: "Excellent! This is the safest action." },
            { id: "run_outside", text: "Run outside", image: IMAGE_PLACEHOLDERS.choice_run, feedback: "Dangerous! Falling debris can injure you." },
            { id: "stand_doorway", text: "Stand in a doorway", image: IMAGE_PLACEHOLDERS.choice_doorway, feedback: "Less effective than covering under furniture." }
        ]
    },
    "drop_cover": {
        text: "The shaking stops. You are safe. What is your next step?",
        image: IMAGE_PLACEHOLDERS.safe_cover,
        choices: [
            { id: "check_hazards", text: "Check for injuries and hazards", image: IMAGE_PLACEHOLDERS.choice_check, feedback: "Correct. Prioritize safety and assessment." },
            { id: "ignore_hazards", text: "Ignore and go back to normal", image: IMAGE_PLACEHOLDERS.choice_ignore, feedback: "Risky. Hidden dangers might be present." }
        ]
    },
    "run_outside": {
        text: "You ran outside. Debris is falling around you, and you are injured. Game Over.",
        image: IMAGE_PLACEHOLDERS.run_outside,
        choices: [] // End of this path
    },
    "stand_doorway": {
        text: "You stood in a doorway. Some plaster fell. The shaking stops. What is your next step?",
        image: IMAGE_PLACEHOLDERS.after_shaking,
        choices: [
            { id: "check_hazards", text: "Check for injuries and hazards", image: IMAGE_PLACEHOLDERS.choice_check, feedback: "Good. Assess the situation carefully." },
            { id: "ignore_hazards", text: "Ignore and go back to normal", image: IMAGE_PLACEHOLDERS.choice_ignore, feedback: "Risky. Hidden dangers might be present." }
        ]
    },
    "check_hazards": {
        text: "You notice a strong smell of gas. What is your next action?",
        image: IMAGE_PLACEHOLDERS.gas_leak,
        choices: [
            { id: "fix_leak", text: "Try to find and fix the leak", image: IMAGE_PLACEHOLDERS.choice_fix, feedback: "Extremely dangerous! Could cause an explosion." },
            { id: "evacuate_call", text: "Evacuate and call gas company", image: IMAGE_PLACEHOLDERS.choice_evacuate, feedback: "Correct. Evacuate immediately and call from a safe distance." }
        ]
    },
    "ignore_hazards": {
        text: "You ignored hazards and went back to normal. Later, you discover a gas leak that leads to a dangerous situation. Game Over.",
        image: IMAGE_PLACEHOLDERS.game_over,
        choices: [] // End of this path
    },
    "fix_leak": {
        text: "You tried to fix the leak. The situation escalates dangerously. Game Over.",
        image: IMAGE_PLACEHOLDERS.game_over,
        choices: [] // End of this path
    },
    "evacuate_call": {
        text: "You successfully evacuated and called for help. You have completed this drill safely!",
        image: IMAGE_PLACEHOLDERS.evacuate_safe,
        choices: [] // End of this path
    }
};

const DisasterVisualGame = () => {
    const [currentScenarioId, setCurrentScenarioId] = useState("start");
    const [feedback, setFeedback] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    const currentScenario = gameScenarios[currentScenarioId];
    const isGameOver = currentScenario.choices.length === 0 && currentScenarioId !== "start";

    const handleChoiceClick = (choiceId) => {
        const chosen = currentScenario.choices.find(c => c.id === choiceId);
        if (chosen) {
            setFeedback(chosen.feedback);
            setShowFeedback(true);
            // After showing feedback, transition to the next scenario
            setTimeout(() => {
                setCurrentScenarioId(choiceId);
                setFeedback('');
                setShowFeedback(false);
            }, 2000); // Show feedback for 2 seconds
        }
    };

    const handleRestartGame = () => {
        setCurrentScenarioId("start");
        setFeedback('');
        setShowFeedback(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Disaster Scenario Visualizer
                </Typography>

                <Card sx={{ mt: 4, p: 3 }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={currentScenario.image}
                        alt="Scenario Background"
                        sx={{ objectFit: 'cover', mb: 2 }}
                    />
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom color="#333333">
                            Scenario:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }} color="#333333">
                            {currentScenario.text}
                        </Typography>

                        {showFeedback && feedback && (
                            <Paper elevation={1} sx={{ p: 2, mt: 2, mb: 3, backgroundColor: '#F3F4F6' }}>
                                <Typography variant="body2" color="#333333">
                                    <strong>Feedback:</strong> {feedback}
                                </Typography>
                            </Paper>
                        )}

                        {!isGameOver && !showFeedback && (
                            <Grid container spacing={2} justifyContent="center">
                                {currentScenario.choices.map((choice) => (
                                    <Grid item key={choice.id}>
                                        <CardActionArea onClick={() => handleChoiceClick(choice.id)} sx={{ width: 150, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                                            <img src={choice.image} alt={choice.text} style={{ width: 80, height: 80, objectFit: 'contain' }} />
                                            <Typography variant="caption" align="center" sx={{ mt: 1 }} color="#333333">
                                                {choice.text}
                                            </Typography>
                                        </CardActionArea>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {isGameOver && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button variant="contained" onClick={handleRestartGame} color="primary">
                                    Restart Game
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default DisasterVisualGame;
