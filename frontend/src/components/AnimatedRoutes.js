import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Emergency from '../pages/Emergency';
import Games from '../pages/Games';
import VirtualDrills from '../pages/VirtualDrills';
import Profile from '../pages/Profile';
import Leaderboard from '../pages/Leaderboard';
import DisasterAnalysis from '../pages/DisasterAnalysis';
import DisasterVisualGame from '../pages/DisasterVisualGame';

const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/games" element={<Games />} />
      <Route path="/drills" element={<VirtualDrills />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/disaster-analysis" element={<DisasterAnalysis />} />
      <Route path="/visual-game" element={<DisasterVisualGame />} />
    </Routes>
  );
};

export default AnimatedRoutes;