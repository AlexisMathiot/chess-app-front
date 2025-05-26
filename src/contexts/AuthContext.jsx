import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock authentication - replace with actual implementation
const MOCK_USER = {
  id: '1',
  username: 'chessmaster',
  email: 'chess@example.com'
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would validate credentials with a backend
      if (email && password) {
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
        setAuthState({
          user: MOCK_USER,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would send registration data to backend
      if (username && email && password) {
        const newUser = { ...MOCK_USER, username, email };
        localStorage.setItem('user', JSON.stringify(newUser));
        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error('Missing required fields');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}