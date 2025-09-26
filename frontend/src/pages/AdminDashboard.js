import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Tabs,
    Tab,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [tab, setTab] = useState(0);
    const { token, user: loggedInUser } = useAuth();
    const [newQuestion, setNewQuestion] = useState({ question: '', options: '', answer: '' });
    const [editingQuestion, setEditingQuestion] = useState(null); // State for question being edited
    const [editedQuestionData, setEditedQuestionData] = useState({ question: '', options: '', answer: '' }); // State for edit form
    const [geminiTopic, setGeminiTopic] = useState(''); // State for Gemini quiz topic
    const [geminiNumQuestions, setGeminiNumQuestions] = useState(5); // State for number of Gemini questions
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState([]);
    const [disasterData, setDisasterData] = useState([]);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', phone: '', contact_type: '', location: '' });
    const [editingContact, setEditingContact] = useState(null);
    const [editedContactData, setEditedContactData] = useState({ name: '', phone: '', contact_type: '', location: '' });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuizzes, setSelectedQuizzes] = useState([]);
    const [selectAllQuizzes, setSelectAllQuizzes] = useState(false);
    const [selectedDisasters, setSelectedDisasters] = useState([]);
    const [selectAllDisasters, setSelectAllDisasters] = useState(false);
    // New state variables for Live Demos
    const [newDemoTitle, setNewDemoTitle] = useState('');
    const [newDemoDescription, setNewDemoDescription] = useState('');
    const [newDemoYoutubeLink, setNewDemoYoutubeLink] = useState('');
    const [liveDemos, setLiveDemos] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editDemoTitle, setEditDemoTitle] = useState('');
    const [editDemoDescription, setEditDemoDescription] = useState('');
    const [editDemoYoutubeLink, setEditDemoYoutubeLink] = useState('');
    const [editingDemoId, setEditingDemoId] = useState(null);
  
  const handleSelectQuiz = (id) => {
    setSelectedQuizzes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((quizId) => quizId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllQuizzes = () => {
    if (selectAllQuizzes) {
      setSelectedQuizzes([]);
    } else {
      setSelectedQuizzes(questions.map((question) => question._id));
    }
    setSelectAllQuizzes(!selectAllQuizzes);
  };

  const handleSelectDisaster = (id) => {
    setSelectedDisasters((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((disasterId) => disasterId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelectedQuizzes = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedQuizzes.length} selected quizzes?`)) {
      try {
        await axios.post('http://localhost:5000/admin/questions/delete-many', { ids: selectedQuizzes }, {
          headers: { 'x-access-token': token }
        });
        setQuestions(questions.filter(question => !selectedQuizzes.includes(question._id)));
        setSelectedQuizzes([]);
        setSelectAllQuizzes(false);
        alert('Selected quizzes deleted successfully!');
      } catch (error) {
        console.error('Error deleting selected quizzes:', error);
        alert('Failed to delete selected quizzes.');
      }
    }
  };

  const handleSelectAllDisasters = () => {
    if (selectAllDisasters) {
      setSelectedDisasters([]);
    } else {
      setSelectedDisasters(disasterData.map((disaster) => disaster._id));
    }
    setSelectAllDisasters(!selectAllDisasters);
  };

    const fetchEmergencyContacts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/emergency/emergency_contacts', {
                headers: { 'x-access-token': token }
            });
            setEmergencyContacts(response.data);
        } catch (error) {
            console.error('Error fetching emergency contacts:', error);
        }
    };

    useEffect(() => {
        if (!loggedInUser || loggedInUser.role !== 'admin') {
            navigate('/');
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/users', {
                    headers: { 'x-access-token': token }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/game/questions', {
                    headers: { 'x-access-token': token }
                });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const fetchDisasters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_daily_reports', {
                    headers: { 'x-access-token': token }
                });
                setDisasterData(response.data);
                console.log("Fetched disaster data:", response.data); // Debug log
            } catch (error) {
                console.error('Error fetching disasters:', error);
            }
        };

        if (token && loggedInUser && loggedInUser.role === 'admin') {
            fetchUsers();
            fetchQuestions();
            fetchDisasters();
            fetchEmergencyContacts();
            fetchLiveDemos();
        }
    }, [token, loggedInUser, navigate]);

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
                headers: { 'x-access-token': token }
            });
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:5000/admin/users/${userId}/role`, 
                { role: newRole },
                { headers: { 'x-access-token': token } }
            );
            // Update the local state to reflect the role change
            setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
            ));
            alert('User role updated successfully!');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Failed to update user role.');
        }
    };

    const deleteQuestion = async (questionId) => {
        try {
            await axios.delete(`http://localhost:5000/admin/questions/${questionId}`, {
                headers: { 'x-access-token': token }
            });
            setQuestions(questions.filter(q => q._id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleDeleteDisaster = async (disasterId) => {
        if (window.confirm('Are you sure you want to delete this disaster entry?')) {
            try {
                await axios.delete(`http://localhost:5000/delete_daily_report/${disasterId}`, {
                    headers: { 'x-access-token': token }
                });
                setDisasterData(disasterData.filter(disaster => disaster._id !== disasterId));
                alert('Disaster entry deleted successfully!');
            } catch (error) {
                console.error('Error deleting disaster entry:', error);
                alert('Failed to delete disaster entry.');
            }
        }
    };

    const handleNewQuestionChange = (e) => {
        setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
    };

    const addQuestion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/admin/questions', { ...newQuestion, options: newQuestion.options.split(',') }, {
                headers: { 'x-access-token': token }
            });
            setQuestions([...questions, response.data.question]);
            setNewQuestion({ question: '', options: '', answer: '' });
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question._id);
        setEditedQuestionData({
            question: question.question,
            options: question.options.join(','), // Convert array back to comma-separated string
            answer: question.answer
        });
    };

    const handleEditFormChange = (e) => {
        setEditedQuestionData({ ...editedQuestionData, [e.target.name]: e.target.value });
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/admin/questions/${editingQuestion}`, editedQuestionData, {
                headers: { 'x-access-token': token }
            });
            setQuestions(questions.map(q => q._id === editingQuestion ? { ...q, ...editedQuestionData, options: editedQuestionData.options.split(',') } : q));
            setEditingQuestion(null);
            setEditedQuestionData({ question: '', options: '', answer: '' });
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingQuestion(null);
        setEditedQuestionData({ question: '', options: '', answer: '' });
    };

    const handleGenerateQuiz = async () => {
        try {
            const response = await axios.post('http://localhost:5000/admin/generate_quiz', {
                topic: geminiTopic,
                num_questions: parseInt(geminiNumQuestions)
            }, {
                headers: { 'x-access-token': token }
            });
            console.log('Generated quiz:', response.data);
            // Optionally, refetch questions to update the table
            // fetchQuestions(); 
            alert(response.data.message);
        } catch (error) {
            console.error('Error generating quiz:', error);
            alert('Error generating quiz: ' + (error.response?.data?.message || error.message));
        }
    };

  const handleDeleteSelectedDisasters = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedDisasters.length} selected disaster entries?`)) {
      try {
        await axios.post('http://localhost:5000/admin/disasters/delete-many', { ids: selectedDisasters }, {
          headers: { 'x-access-token': token }
        });
        setDisasterData(disasterData.filter(disaster => !selectedDisasters.includes(disaster._id)));
        setSelectedDisasters([]);
        setSelectAllDisasters(false);
        alert('Selected disaster entries deleted successfully!');
      } catch (error) {
        console.error('Error deleting selected disaster entries:', error);
        alert('Failed to delete selected disaster entries.');
      }
    }
  };

    const handleNewContactChange = (e) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const addContact = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/emergency/emergency_contacts', newContact, {
                headers: { 'x-access-token': token }
            });
            setEmergencyContacts([...emergencyContacts, response.data.contact]);
            setNewContact({ name: '', phone: '', contact_type: '', location: '' });
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };
    
    const deleteContact = async (contactId) => {
        try {
            await axios.delete(`http://localhost:5000/emergency/emergency_contacts/${contactId}`, {
                headers: { 'x-access-token': token }
            });
            setEmergencyContacts(emergencyContacts.filter(c => c._id !== contactId));
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleEditContactClick = (contact) => {
        setEditingContact(contact._id);
        setEditedContactData(contact);
    };

    const handleEditContactFormChange = (e) => {
        setEditedContactData({ ...editedContactData, [e.target.name]: e.target.value });
    };

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/emergency/emergency_contacts/${editingContact}`, editedContactData, {
                headers: { 'x-access-token': token }
            });
            setEmergencyContacts(emergencyContacts.map(c => c._id === editingContact ? editedContactData : c));
            setEditingContact(null);
            setEditedContactData({ name: '', phone: '', contact_type: '', location: '' });
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const handleCancelEditContact = () => {
        setEditingContact(null);
        setEditedContactData({ name: '', phone: '', contact_type: '', location: '' });
    };

    const fetchLiveDemos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admin/live-demos', {
                headers: { 'x-access-token': token }
            });
            setLiveDemos(response.data);
        } catch (error) {
            console.error('Error fetching live demos:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    // Handler functions for Live Demos
    const handleAddLiveDemo = async () => {
        try {
            await axios.post('http://localhost:5000/admin/live-demos', {
                title: newDemoTitle,
                description: newDemoDescription,
                youtube_link: newDemoYoutubeLink
            }, {
                headers: { 'x-access-token': token }
            });
            setNewDemoTitle('');
            setNewDemoDescription('');
            setNewDemoYoutubeLink('');
            fetchLiveDemos(); // Re-fetch to update the list
            alert('Live Demo added successfully!');
        } catch (error) {
            console.error('Error adding live demo:', error);
            alert('Failed to add live demo.');
        }
    };

    const handleEditLiveDemoClick = (demo) => {
        setEditingDemoId(demo._id); // Set the ID of the demo being edited
        setEditDemoTitle(demo.title);
        setEditDemoDescription(demo.description);
        setEditDemoYoutubeLink(demo.youtube_link);
        setEditDialogOpen(true);
    };

    const handleDeleteLiveDemo = async (demoId) => {
        if (window.confirm('Are you sure you want to delete this live demo?')) {
            try {
                await axios.delete(`http://localhost:5000/admin/live-demos/${demoId}`, {
                    headers: { 'x-access-token': token }
                });
                fetchLiveDemos(); // Re-fetch to update the list
                alert('Live Demo deleted successfully!');
            } catch (error) {
                console.error('Error deleting live demo:', error);
                alert('Failed to delete live demo.');
            }
        }
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditingDemoId(null);
        setEditDemoTitle('');
        setEditDemoDescription('');
        setEditDemoYoutubeLink('');
    };

    const handleUpdateLiveDemo = async () => {
        try {
            await axios.put(`http://localhost:5000/admin/live-demos/${editingDemoId}`, {
                title: editDemoTitle,
                description: editDemoDescription,
                youtube_link: editDemoYoutubeLink
            }, {
                headers: { 'x-access-token': token }
            });
            setEditDialogOpen(false);
            setEditingDemoId(null);
            setEditDemoTitle('');
            setEditDemoDescription('');
            setEditDemoYoutubeLink('');
            fetchLiveDemos(); // Re-fetch to update the list
            alert('Live Demo updated successfully!');
        } catch (error) {
            console.error('Error updating live demo:', error);
            alert('Failed to update live demo.');
        }
    };

        return (
            <React.Fragment>
            <Container maxWidth="lg">
                {loggedInUser ? (
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom color="#FFFFFF">
                            Admin Dashboard
                        </Typography>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
                                <Tab label="Users" sx={{ color: '#FFFFFF' }} />
                                <Tab label="Game Questions" sx={{ color: '#FFFFFF' }} />
                                <Tab label="Disaster Analysis" sx={{ color: '#FFFFFF' }} />
                                <Tab label="Emergency Contacts" sx={{ color: '#FFFFFF' }} />
                                <Tab label="Live Demos" sx={{ color: '#FFFFFF' }} />
                            </Tabs>
                        </Box>
                        {tab === 0 && (
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                                                        {users.map(user => (
                                                                            <TableRow key={user._id}>
                                                                                <TableCell>{user.username}</TableCell>
                                                                                <TableCell>
                                                                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                                                                        <Select
                                                                                            value={user.role}
                                                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                                                            label="Role"
                                                                                            disabled={user._id === loggedInUser.user_id} // Disable if it's the current user
                                                                                        >
                                                                                            <MenuItem value="admin">Admin</MenuItem>
                                                                                            <MenuItem value="teacher">Teacher</MenuItem>
                                                                                            <MenuItem value="student">Student</MenuItem>
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Button variant="contained" color="secondary" onClick={() => deleteUser(user._id)}>Delete</Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {tab === 1 && (
                            <Box sx={{ mt: 2 }}>
                                {/* Gemini Quiz Generation Section */}
                                <Paper sx={{ mb: 4, p: 2 }}>
                                    <Typography variant="h5" component="h2" gutterBottom color="#333333">Generate Quiz with Gemini AI</Typography>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Quiz Topic"
                                        value={geminiTopic}
                                        onChange={(e) => setGeminiTopic(e.target.value)}
                                        InputLabelProps={{ style: { color: '#333333' } }}
                                        InputProps={{ style: { color: '#333333' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Number of Questions"
                                        type="number"
                                        value={geminiNumQuestions}
                                        onChange={(e) => setGeminiNumQuestions(e.target.value)}
                                        InputLabelProps={{ style: { color: '#333333' } }}
                                        InputProps={{ style: { color: '#333333' } }}
                                    />
                                    <Button variant="contained" onClick={handleGenerateQuiz} sx={{ mt: 2 }}>
                                        Generate Quiz
                                    </Button>
                                </Paper>
    
                                <Paper component="form" onSubmit={addQuestion} sx={{ mb: 2, p: 2 }}>
                                    <Typography variant="h5" component="h2" gutterBottom color="#333333">Add New Question</Typography>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        name="question"
                                        label="Question"
                                        value={newQuestion.question}
                                        onChange={handleNewQuestionChange}
                                        InputLabelProps={{ style: { color: '#333333' } }}
                                        InputProps={{ style: { color: '#333333' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        name="options"
                                        label="Options (comma separated)"
                                        value={newQuestion.options}
                                        onChange={handleNewQuestionChange}
                                        InputLabelProps={{ style: { color: '#333333' } }}
                                        InputProps={{ style: { color: '#333333' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        name="answer"
                                        label="Answer"
                                        value={newQuestion.answer}
                                        onChange={handleNewQuestionChange}
                                        InputLabelProps={{ style: { color: '#333333' } }}
                                        InputProps={{ style: { color: '#333333' } }}
                                    />
                                    <Button type="submit" variant="contained">Add Question</Button>
                                </Paper>
    
                                <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }} color="#FFFFFF">Manage Existing Questions</Typography>
                                <Paper sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectAllQuizzes}
                                                onChange={handleSelectAllQuizzes}
                                            />
                                        }
                                        label={<Typography color="#333333">Select All</Typography>}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleDeleteSelectedQuizzes}
                                        disabled={selectedQuizzes.length === 0}
                                        sx={{ ml: 2 }}
                                    >
                                        Delete Selected Quizzes
                                    </Button>
                                </Paper>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Question</TableCell>
                                                <TableCell>Answer</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {questions.map(q => (
                                                <TableRow key={q._id}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedQuizzes.includes(q._id)}
                                                            onChange={() => handleSelectQuiz(q._id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{q.question}</TableCell>
                                                    <TableCell>{q.answer}</TableCell>
                                                    <TableCell>
                                                        {editingQuestion === q._id ? (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button variant="contained" color="primary" onClick={handleUpdateQuestion}>Save</Button>
                                                                <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button variant="contained" color="primary" onClick={() => handleEditClick(q)}>Edit</Button>
                                                                <Button variant="contained" color="secondary" onClick={() => deleteQuestion(q._id)}>Delete</Button>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
    
                                {editingQuestion && (
                                    <Paper component="form" onSubmit={handleUpdateQuestion} sx={{ mt: 4, p: 2 }}>
                                        <Typography variant="h6" component="h3" gutterBottom color="#333333">Edit Question</Typography>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            name="question"
                                            label="Question"
                                            value={editedQuestionData.question}
                                            onChange={handleEditFormChange}
                                            InputLabelProps={{ style: { color: '#333333' } }}
                                            InputProps={{ style: { color: '#333333' } }}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            name="options"
                                            label="Options (comma separated)"
                                            value={editedQuestionData.options}
                                            onChange={handleEditFormChange}
                                            InputLabelProps={{ style: { color: '#333333' } }}
                                            InputProps={{ style: { color: '#333333' } }}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            name="answer"
                                            label="Answer"
                                            value={editedQuestionData.answer}
                                            onChange={handleEditFormChange}
                                            InputLabelProps={{ style: { color: '#333333' } }}
                                            InputProps={{ style: { color: '#333333' } }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                                            <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                                        </Box>
                                    </Paper>
                                )}
                            </Box>
                        )}
                        {tab === 2 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h5" component="h2" gutterBottom color="#FFFFFF">Manage Disaster Analysis Entries</Typography>
                                <Paper sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleDeleteSelectedDisasters}
                                        disabled={selectedDisasters.length === 0}
                                        sx={{ ml: 2 }}
                                    >
                                        Delete Selected Disasters
                                    </Button>
                                </Paper>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectAllDisasters}
                                                        onChange={handleSelectAllDisasters}
                                                    />
                                                </TableCell>
                                                <TableCell>Disaster Type</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {disasterData.map((disaster) => (
                                                <TableRow key={disaster._id}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedDisasters.includes(disaster._id)}
                                                            onChange={() => handleSelectDisaster(disaster._id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{disaster.disaster_type || 'N/A'}</TableCell>
                                                    <TableCell>{disaster.location}</TableCell>
                                                    <TableCell>{disaster.date ? new Date(disaster.date).toLocaleDateString() : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => handleDeleteDisaster(disaster._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                        {tab === 3 && (
                        <Box sx={{ mt: 2 }}>
                            <Paper component="form" onSubmit={addContact} sx={{ mb: 2, p: 2 }}>
                                <Typography variant="h5" component="h2" gutterBottom color="#333333">Add New Emergency Contact</Typography>
                                <TextField fullWidth margin="normal" name="name" label="Name" value={newContact.name} onChange={handleNewContactChange} />
                                <TextField fullWidth margin="normal" name="phone" label="Phone" value={newContact.phone} onChange={handleNewContactChange} />
                                <TextField fullWidth margin="normal" name="contact_type" label="Contact Type" value={newContact.contact_type} onChange={handleNewContactChange} />
                                <TextField fullWidth margin="normal" name="location" label="Location" value={newContact.location} onChange={handleNewContactChange} />
                                <Button type="submit" variant="contained">Add Contact</Button>
                            </Paper>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Location</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {emergencyContacts.map(contact => (
                                            <TableRow key={contact._id}>
                                                <TableCell>{contact.name}</TableCell>
                                                <TableCell>{contact.phone}</TableCell>
                                                <TableCell>{contact.contact_type}</TableCell>
                                                <TableCell>{contact.location}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" color="primary" onClick={() => handleEditContactClick(contact)}>Edit</Button>
                                                    <Button variant="contained" color="secondary" onClick={() => deleteContact(contact._id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {editingContact && (
                                <Paper component="form" onSubmit={handleUpdateContact} sx={{ mt: 4, p: 2 }}>
                                    <Typography variant="h6" component="h3" gutterBottom>Edit Emergency Contact</Typography>
                                    <TextField fullWidth margin="normal" name="name" label="Name" value={editedContactData.name} onChange={handleEditContactFormChange} />
                                    <TextField fullWidth margin="normal" name="phone" label="Phone" value={editedContactData.phone} onChange={handleEditContactFormChange} />
                                    <TextField fullWidth margin="normal" name="contact_type" label="Contact Type" value={editedContactData.contact_type} onChange={handleEditContactFormChange} />
                                    <TextField fullWidth margin="normal" name="location" label="Location" value={editedContactData.location} onChange={handleEditContactFormChange} />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        <Button type="submit" variant="contained" color="primary">Save Changes</Button>
                                        <Button variant="outlined" onClick={handleCancelEditContact}>Cancel</Button>
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    )}
                    {tab === 4 && (
                        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)' }}>
                            <Typography variant="h5" component="h2" gutterBottom color="#333333">
                                Live Demos Management
                            </Typography>

                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                <TextField
                                    label="Title"
                                    variant="outlined"
                                    value={newDemoTitle}
                                    onChange={(e) => setNewDemoTitle(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ style: { color: '#333333' } }}
                                    InputProps={{ style: { color: '#333333' } }}
                                />
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    value={newDemoDescription}
                                    onChange={(e) => setNewDemoDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    InputLabelProps={{ style: { color: '#333333' } }}
                                    InputProps={{ style: { color: '#333333' } }}
                                />
                                <TextField
                                    label="YouTube Link"
                                    variant="outlined"
                                    value={newDemoYoutubeLink}
                                    onChange={(e) => setNewDemoYoutubeLink(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ style: { color: '#333333' } }}
                                    InputProps={{ style: { color: '#333333' } }}
                                />
                                <Button variant="contained" color="primary" onClick={handleAddLiveDemo}>
                                    Add Live Demo
                                </Button>
                            </Box>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#333333' }}>Title</TableCell>
                                            <TableCell sx={{ color: '#333333' }}>Description</TableCell>
                                            <TableCell sx={{ color: '#333333' }}>YouTube Link</TableCell>
                                            <TableCell sx={{ color: '#333333' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {liveDemos.map((demo) => (
                                            <TableRow key={demo._id}>
                                                <TableCell sx={{ color: '#333333' }}>{demo.title}</TableCell>
                                                <TableCell sx={{ color: '#333333' }}>{demo.description}</TableCell>
                                                <TableCell sx={{ color: '#333333' }}>{demo.youtube_link}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleEditLiveDemoClick(demo)}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteLiveDemo(demo._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ mt: 4 }}>Loading user data...</Typography>
                )}
            </Container>

            {/* Edit Live Demo Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Live Demo</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Update the details for the live demo.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editDemoTitle}
                        onChange={(e) => setEditDemoTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={editDemoDescription}
                        onChange={(e) => setEditDemoDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="YouTube Link"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editDemoYoutubeLink}
                        onChange={(e) => setEditDemoYoutubeLink(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={handleUpdateLiveDemo} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
};

export default AdminDashboard;