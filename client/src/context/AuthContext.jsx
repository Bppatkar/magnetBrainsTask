import { createContext, useState, useEffect, useContext } from 'react';
import {
  getProfile,
  login as apiLogin,
  register as apiRegister,
} from '../api/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await getProfile();
        setCurrentUser(data);
      } catch (error) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        console.error(error.response?.data?.message);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await apiLogin(email, password);
      localStorage.setItem('token', data.token);
      await checkAuth();
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      console.error('Login failed:', message);
      throw new Error(message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await apiRegister(username, email, password);
      localStorage.setItem('token', data.token);
      await checkAuth();
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Registration failed:', message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
