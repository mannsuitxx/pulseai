import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api'; // Import the centralized API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add token state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
                    const decodedUser = jwtDecode(storedToken);
                    setUser(decodedUser);
        setToken(storedToken); // Set token state
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username_or_email, password) => {
    try {
      const response = await api.post('/login', { username_or_email, password });
      // The backend now sends an OTP and a message, not a token directly
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error for the calling component to handle
    }
  };

  const verifyOtp = async (username_or_email, otp) => {
    try {
      const response = await api.post('/verify_login_otp', { username_or_email, otp });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token); // Set token state on login
      try {
        const decodedUser = jwtDecode(response.data.token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token on login:", error);
        setUser(null);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, email, password) => {
    const response = await api.post('/api/auth/signup', { username, email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token); // Set token state on signup
    try {
            const decodedUser = jwtDecode(response.data.token);
            setUser(decodedUser);
    } catch (error) {
      console.error("Failed to decode token on signup:", error);
      setUser(null);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear token state on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, verifyOtp }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
