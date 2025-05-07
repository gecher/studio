
'use client';

import type { User } from '@/app/admin/_types'; // Using existing User type for simplicity
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (user: User) => void;
  signup: (user: User) => void;
  logout: () => void;
  mounted: boolean;
}

const AUTH_STORAGE_KEY = 'easymeds_currentUser';

// Mock admin user for demonstration
export const MOCK_ADMIN_USER: User = {
  id: 'usr_admin_001',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  dateJoined: new Date().toISOString().split('T')[0],
  lastLogin: new Date().toISOString().split('T')[0],
  accountType: 'basic', // Admins can also have an account type, or it can be role-specific
};

// Mock regular user for demonstration
export const MOCK_REGULAR_USER: User = {
  id: 'usr_mock_001',
  name: 'Mock Customer',
  email: 'customer@example.com',
  role: 'customer',
  status: 'active',
  dateJoined: new Date().toISOString().split('T')[0],
  lastLogin: new Date().toISOString().split('T')[0],
  accountType: 'basic', // Default account type for a customer
  insuranceProvider: 'Nyala Insurance',
  insurancePolicyNumber: 'NYL-MOCK-789',
  insuranceVerified: true,
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  };

  const signup = (user: User) => {
    // For mock, directly "log in" the user after signup
    setIsAuthenticated(true);
    setCurrentUser(user);
     try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to localStorage during signup:", error);
    }
    // Real app: API call, then potentially login or redirect to login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user from localStorage:", error);
    }
  };

  const contextValue = {
    isAuthenticated: mounted ? isAuthenticated : false, // Avoid hydration mismatch on initial load
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
