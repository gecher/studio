
'use client';

import type { User } from '@/app/admin/_types'; // Using existing User type for simplicity
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (user: User) => void; // Simplified login, real app would take credentials
  signup: (user: User) => void; // Simplified signup
  logout: () => void;
  mounted: boolean;
}

// Mock current user for demonstration after "login"
const MOCK_LOGGED_IN_USER: User = {
  id: 'usr_mock_001',
  name: 'Mock User',
  email: 'mock.user@example.com',
  role: 'customer',
  status: 'active',
  dateJoined: new Date().toISOString().split('T')[0],
  lastLogin: new Date().toISOString().split('T')[0],
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, you might check for a token in localStorage here
    // For mock purposes, we start unauthenticated
  }, []);

  const login = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    // In a real app, set token in localStorage
  };

  const signup = (user: User) => {
    // For mock, directly "log in" the user after signup
    setIsAuthenticated(true);
    setCurrentUser(user);
    // Real app: API call, then potentially login or redirect to login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // In a real app, clear token from localStorage
  };

  const contextValue = {
    isAuthenticated: mounted ? isAuthenticated : false, // Reflect actual state only after mount
    currentUser: mounted ? currentUser : null,
    login,
    signup,
    logout,
    mounted,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
