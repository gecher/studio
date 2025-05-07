
'use client';

import type { User } from '@/app/admin/_types'; 
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

// Mock users for demonstration
const today = new Date().toISOString().split('T')[0];

export const MOCK_ADMIN_USER: User = {
  id: 'usr_admin_001',
  name: 'Admin EasyMeds',
  email: 'admin@example.com',
  password: 'adminpass', // Added password
  role: 'admin',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'basic', 
  avatarUrl: 'https://picsum.photos/seed/admin/200'
};

export const MOCK_BASIC_CUSTOMER_USER: User = {
  id: 'usr_customer_001',
  name: 'Abebe Bikila',
  email: 'customer@example.com',
  password: 'customerpass', // Added password
  role: 'customer',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'basic',
  insuranceProvider: 'Nyala Insurance',
  insurancePolicyNumber: 'NYL-CUST-123',
  insuranceVerified: true,
  avatarUrl: 'https://picsum.photos/seed/customer1/200'
};

export const MOCK_PLUS_CUSTOMER_USER: User = {
  id: 'usr_customer_002',
  name: 'Tirunesh Dibaba',
  email: 'pluscustomer@example.com',
  password: 'pluspass', // Added password
  role: 'customer',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'easymeds_plus',
  insuranceProvider: 'CBHI',
  insurancePolicyNumber: 'CBHI-PLUS-456',
  insuranceVerified: true,
  avatarUrl: 'https://picsum.photos/seed/customer2/200'
};

export const MOCK_PHARMACIST_USER: User = {
  id: 'usr_pharmacist_001',
  name: 'Pharmacist Fatuma',
  email: 'pharmacist@example.com',
  password: 'pharmacistpass', // Added password
  role: 'pharmacist',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'basic', 
  avatarUrl: 'https://picsum.photos/seed/pharmacist/200'
};

export const MOCK_DOCTOR_USER: User = {
  id: 'usr_doctor_001',
  name: 'Dr. Kenenisa',
  email: 'doctor@example.com',
  password: 'doctorpass', // Added password
  role: 'doctor',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'basic', 
  avatarUrl: 'https://picsum.photos/seed/doctor/200'
};

export const MOCK_PARTNER_USER: User = {
  id: 'usr_partner_001',
  name: 'Bole Pharmacy Partner',
  email: 'partner@example.com',
  password: 'partnerpass', // Added password
  role: 'partner',
  status: 'active',
  dateJoined: today,
  lastLogin: today,
  accountType: 'basic', 
  avatarUrl: 'https://picsum.photos/seed/partner/200'
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

