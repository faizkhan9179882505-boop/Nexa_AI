import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
            
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/auth/signup', { 
        username, 
        email, 
        password 
      });
      
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
            
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and axios headers
      localStorage.removeItem('token');
            setUser(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
