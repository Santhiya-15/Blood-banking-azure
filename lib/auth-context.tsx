'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'staff' | 'donor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bloodbank_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error('[v0] Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('bloodbank_users') || '{}');

    const userCreds = registeredUsers[email];
    if (!userCreds || userCreds.password !== password) {
      throw new Error('Invalid email or password');
    }

    const newUser: User = {
      id: userCreds.id,
      email,
      name: userCreds.name,
      role: userCreds.role,
    };

    setUser(newUser);
    localStorage.setItem('bloodbank_user', JSON.stringify(newUser));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // Get existing users
    const registeredUsers = JSON.parse(localStorage.getItem('bloodbank_users') || '{}');

    // Check if user already exists
    if (registeredUsers[email]) {
      throw new Error('Email already registered');
    }

    // Validate password
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create new user
    const userId = Math.random().toString(36).substr(2, 9);
    registeredUsers[email] = {
      id: userId,
      password,
      name,
      role,
    };

    // Save to localStorage
    localStorage.setItem('bloodbank_users', JSON.stringify(registeredUsers));

    // Auto login after signup
    const newUser: User = {
      id: userId,
      email,
      name,
      role,
    };

    setUser(newUser);
    localStorage.setItem('bloodbank_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bloodbank_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
