/**
 * Auth Context for HealthGuard Vision
 * Manages authentication state across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loginApi,
  registerApi,
  getProfileApi,
  getToken,
  setToken,
  removeToken,
  type User,
} from '@/services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, sex: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing token on app load
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      if (token) {
        const user = await getProfileApi();
        setState({ user, isLoading: false, isAuthenticated: true });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      // Token expired or invalid
      await removeToken();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }

  async function login(email: string, password: string) {
    const { token, user } = await loginApi(email, password);
    await setToken(token);
    setState({ user, isLoading: false, isAuthenticated: true });
  }

  async function register(firstName: string, lastName: string, sex: string, email: string, password: string) {
    const { token, user } = await registerApi(firstName, lastName, sex, email, password);
    await setToken(token);
    setState({ user, isLoading: false, isAuthenticated: true });
  }

  async function logout() {
    await removeToken();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
