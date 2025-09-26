
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Card,
    CardContent,
    CardActions,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';

const drillsData = {
    "start_earthquake": {
        scenario: "You are at home when a strong earthquake begins. The ground is shaking violently. What is your immediate action?",
        image: "/images/earthquake_start.jpg", // Placeholder for image
        choices: [
            {
                text: "Run outside to an open area.",
                feedback: "Running outside during an earthquake can be extremely dangerous due to falling debris, power lines, and unstable structures. It's safer to stay indoors and protect yourself from falling objects.",
                nextScenarioId: "earthquake_exposed_outside"
            },
            {
                text: "Drop, Cover, and Hold On under sturdy furniture like a table or desk.",
                feedback: "Excellent choice! 'Drop, Cover, and Hold On' is the safest action during an earthquake. This protects you from falling objects and debris. Stay there until the shaking stops.",
                nextScenarioId: "earthquake_safe_inside"
            },
            {
                text: "Stand in a doorway.",
                feedback: "While once recommended, doorways in modern homes are often not stronger than other parts of the structure and may not protect you from falling objects. Sturdy furniture offers better protection.",
                nextScenarioId: "earthquake_less_safe_doorway"
            }
        ]
    },
    "earthquake_exposed_outside": {
        scenario: "You ran outside, but now power lines are swaying, and debris is falling around you. The ground is still shaking. What do you do?",
        image: "/images/earthquake_outside.jpg",
        choices: [
            {
                text: "Try to run back inside your house.",
                feedback: "Going back inside during an earthquake is risky as the structure might be compromised. It's better to find an open space.",
                nextScenarioId: "earthquake_exposed_outside_continue"
            },
            {
                text: "Crouch down in an open area away from buildings, trees, and power lines, covering your head and neck.",
                feedback: "Good decision. If you are caught outside, moving to an open area and protecting yourself is the best course of action until the shaking stops.",
                nextScenarioId: "earthquake_safe_outside"
            }
        ]
    },
    "earthquake_safe_inside": {
        scenario: "The shaking has stopped. You are safe under your sturdy furniture. What is your next step?",
        image: "/images/earthquake_after_shaking.jpg",
        choices: [
            {
                text: "Immediately rush outside to check on neighbors.",
                feedback: "It's important to check for hazards inside your home first. Aftershocks can occur, and damaged utilities can pose risks. Ensure your immediate surroundings are safe before moving.",
                nextScenarioId: "earthquake_check_hazards_inside"
            },
            {
                text: "Stay put for a moment, then carefully check yourself and those around you for injuries. Assess your immediate surroundings for hazards.",
                feedback: "Correct. After the shaking stops, take a moment to ensure personal safety and check for immediate hazards like gas leaks, fires, or structural damage before moving.",
                nextScenarioId: "earthquake_check_hazards_inside"
            }
        ]
    },
    "earthquake_less_safe_doorway": {
        scenario: "You stood in a doorway. The shaking was intense, and some plaster fell from the ceiling. What do you do now that the shaking has stopped?",
        image: "/images/earthquake_after_shaking.jpg",
        choices: [
            {
                text: "Proceed with caution, checking for injuries and hazards.",
                feedback: "Good. Always prioritize safety and assess your surroundings after an earthquake.",
                nextScenarioId: "earthquake_check_hazards_inside"
            }
        ]
    },
    "earthquake_check_hazards_inside": {
        scenario: "You've checked for injuries and immediate hazards. You notice a strong smell of gas. What is your next action?",
        image: "/images/gas_leak.jpg",
        choices: [
            {
                text: "Try to find the source of the leak and fix it.",
                feedback: "Never try to fix a gas leak yourself. This can be extremely dangerous and lead to an explosion.",
                nextScenarioId: "earthquake_gas_leak_danger"
            },
            {
                text: "Open windows and doors, then evacuate immediately and call the gas company from a safe distance.",
                feedback: "Absolutely correct. Ventilate the area, evacuate everyone, and contact emergency services or the gas company from a safe location. Do not use any electrical switches or phones inside.",
                nextScenarioId: "drill_complete_gas_safe"
            }
        ]
    },
    "earthquake_gas_leak_danger": {
        scenario: "You tried to find the leak, and now the smell is even stronger. You hear a hissing sound. What do you do?",
        image: "/images/gas_leak_danger.jpg",
        choices: [
            {
                text: "Evacuate immediately and call for help from a safe distance.",
                feedback: "This is the only safe option. Get everyone out immediately and call the gas company or 911 from a safe distance. Do not re-enter the building.",
                nextScenarioId: "drill_complete_gas_safe"
            }
        ]
    },
    "earthquake_safe_outside": {
        scenario: "The shaking has stopped. You are in a safe open area. What is your next step?",
        image: "/images/earthquake_after_shaking_outside.jpg",
        choices: [
            {
                text: "Carefully move to a designated safe assembly point, if one exists, or a safe open space.",
                feedback: "Good. Once the shaking stops, assess your surroundings and move to a safe, open area, being mindful of potential aftershocks and hazards.",
                nextScenarioId: "drill_complete_outside_safe"
            }
        ]
    },
    "drill_complete_gas_safe": {
        scenario: "You successfully evacuated and called for help. You have completed this earthquake drill focusing on immediate actions and gas leak response.",
        image: "/images/drill_complete.jpg",
        choices: [] // End of drill branch
    },
    "drill_complete_outside_safe": {
        scenario: "You remained safe outside and moved to an assembly point. You have completed this earthquake drill focusing on immediate actions when caught outside.",
        image: "/images/drill_complete.jpg",
        choices: [] // End of drill branch
    }
};

const VirtualDrills = () => {
    const [currentScenarioId, setCurrentScenarioId] = useState("start_earthquake");
    const [feedback, setFeedback] = useState('');
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentScenario = drillsData[currentScenarioId];
    const isDrillComplete = currentScenario.choices.length === 0;

    const handleChoiceSelect = (index) => {
        setSelectedChoiceIndex(index);
        setShowFeedback(false);
        setFeedback('');
    };

    const handleProceed = () => {
        if (selectedChoiceIndex !== null) {
            const chosen = currentScenario.choices[selectedChoiceIndex];
            setFeedback(chosen.feedback);
            setShowFeedback(true);
        }
    };

    const handleNext = () => {
        if (selectedChoiceIndex !== null && showFeedback) {
            const chosen = currentScenario.choices[selectedChoiceIndex];
            if (chosen.nextScenarioId) {
                setCurrentScenarioId(chosen.nextScenarioId);
                setSelectedChoiceIndex(null);
                setShowFeedback(false);
                setFeedback('');
            } else {
                // This branch should ideally not be hit if isDrillComplete is handled correctly
                // but as a fallback, if nextScenarioId is missing, consider it complete
                // For now, we'll just stay on the current 'complete' scenario
            }
        }
    };

    const handleRestartDrill = () => {
        setCurrentScenarioId("start_earthquake");
        setFeedback('');
        setSelectedChoiceIndex(null);
        setShowFeedback(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                    Disaster Preparedness Drill: Earthquake
                </Typography>

                <Card sx={{ mt: 4, p: 3, textAlign: 'left' }}>
                    <CardContent>
                        {currentScenario.image && (
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                <img src={currentScenario.image} alt="Scenario Visual" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                            </Box>
                        )}
                        <Typography variant="h5" component="h2" gutterBottom color="#333333">
                            Scenario:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }} color="#333333">
                            {currentScenario.scenario}
                        </Typography>

                        {!isDrillComplete && (
                            <Box>
                                <Typography variant="h6" component="h3" sx={{ mb: 2 }} color="#333333">
                                    Your Choices:
                                </Typography>
                                <RadioGroup
                                    aria-labelledby="drill-choices"
                                    name="drill-choices"
                                    value={selectedChoiceIndex !== null ? selectedChoiceIndex.toString() : ''}
                                    onChange={(e) => handleChoiceSelect(parseInt(e.target.value))}
                                >
                                    {currentScenario.choices.map((choice, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={index.toString()}
                                            control={<Radio />}
                                            label={<Typography color="#333333">{choice.text}</Typography>}
                                            disabled={showFeedback} // Disable choices after feedback is shown
                                        />
                                    ))}
                                </RadioGroup>
                            </Box>
                        )}

                        {showFeedback && feedback && (
                            <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#F3F4F6' }}>
                                <Typography variant="body2" color="#333333">
                                    <strong>Feedback:</strong> {feedback}
                                </Typography>
                            </Paper>
                        )}

                        {isDrillComplete && (
                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="h6" component="h3" gutterBottom color="#333333">
                                    Drill Concluded!
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }} color="#333333">
                                    {currentScenario.scenario}
                                </Typography>
                            </Box>
                        )}

                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', mt: 2 }}>
                        {!isDrillComplete && !showFeedback && (
                            <Button
                                variant="contained"
                                onClick={handleProceed}
                                disabled={selectedChoiceIndex === null}
                                color="primary"
                            >
                                Proceed
                            </Button>
                        )}
                        {!isDrillComplete && showFeedback && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                color="primary"
                            >
                                Next Step
                            </Button>
                        )}
                        {isDrillComplete && (
                            <Button variant="contained" onClick={handleRestartDrill} color="primary">
                                Restart Drill
                            </Button>
                        )}
                    </CardActions>
                </Card>
            </Box>
        </Container>
    );
};

export default VirtualDrills;
