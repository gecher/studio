
'use client';

import type { User } from '@/app/admin/_types'; // Using existing User type for simplicity
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (user: User) => void; // Login now takes the authenticated user object
  signup: (user: User) => void; // Simplified signup
  logout: () => void;
  mounted: boolean;
}

// Mock admin user for demonstration
export const MOCK_ADMIN_USER: User = {
  id: 'usr_admin_001',
  name: 'Admin User',
  email: 'admin@example.com', // Specific email for admin login
  role: 'admin',
  status: 'active',
  dateJoined: new Date().toISOString().split('T')[0],
  lastLogin: new Date().toISOString().split('T')[0],
};

// Mock regular user for demonstration if needed for other signup/login flows
export const MOCK_REGULAR_USER: User = {
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
    isAuthenticated: mounted ? isAuthenticated : false,
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

