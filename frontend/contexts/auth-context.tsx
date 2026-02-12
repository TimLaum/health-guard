/**
 * Auth Context for HealthGuard Vision
 * Manages authentication state across the app
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginApi,
  registerApi,
  getProfileApi,
  getToken,
  setToken,
  removeToken,
  reAuthApi,
  type User,
} from "@/services/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstname: string,
    lastname: string,
    sex: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
        // Refresh the token and fetch latest profile
        const { token: newToken } = await reAuthApi();
        await setToken(newToken);
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
    // Backend POST /auth returns { token } only — fetch profile separately
    const { token } = await loginApi(email, password);
    await setToken(token);
    const user = await getProfileApi();
    setState({ user, isLoading: false, isAuthenticated: true });
  }

  async function register(
    firstname: string,
    lastname: string,
    sex: string,
    email: string,
    password: string,
  ) {
    // Backend POST /signup returns { message } — auto-login after signup
    await registerApi(firstname, lastname, sex, email, password);
    const { token } = await loginApi(email, password);
    await setToken(token);
    const user = await getProfileApi();
    setState({ user, isLoading: false, isAuthenticated: true });
  }

  async function logout() {
    await removeToken();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }

  async function refreshProfile() {
    try {
      const user = await getProfileApi();
      setState((prev) => ({ ...prev, user }));
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
