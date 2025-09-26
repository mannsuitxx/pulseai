
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Emergency from './pages/Emergency';
import Games from './pages/Games';
import VirtualDrills from './pages/VirtualDrills';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import DisasterAnalysis from './pages/DisasterAnalysis';
import DisasterVisualGame from './pages/DisasterVisualGame';
import AnimatedRoutes from './components/AnimatedRoutes'; // Import the new component
import Chatbot from './components/Chatbot';
import './App.css'; // Import the CSS for animations

function App() {

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Blurred Background Element */}
      <div style={{
        backgroundImage: 'url(/images/img113.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        filter: 'blur(5px)',
        WebkitFilter: 'blur(5px)', // For Safari
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2, // Behind the overlay and content
      }} />

      {/* Content Wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 1, // Content above the blurred background and overlay
        paddingBottom: '60px' // Footer height
      }}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <Navbar />
              <AnimatedRoutes />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </div>

      <Chatbot />

      {/* Footer */}
      <footer style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
      }}>Powered by Quantum Thinkers Team</footer>
    </div>
  );
}

export default App;
