// src/contexts/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeToken, isTokenExpired } from "../utils/jwt";
import * as authApi from "../api/auth";
import type { User } from "../types/user";

const TOKEN_KEY = "sls_token";

type LoginArgs = { email: string; password: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (payload: LoginArgs) => Promise<User>;
  register: (payload: any) => Promise<any>;
  logout: (redirectTo?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t && !isTokenExpired(t)) {
        return decodeToken(t);
      }
      return null;
    } catch {
      return null;
    }
  });

  // 🔄 Sync token → user
  useEffect(() => {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return;
    }

    if (isTokenExpired(token)) {
      logout("/login");
      return;
    }

    try {
      const decoded = decodeToken(token);
      setUser(decoded);
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.error("Token decode failed", err);
      logout("/login");
    }
  }, [token]);

  // ✅ LOGIN
  async function login(payload: LoginArgs): Promise<User> {
    const data = await authApi.login(payload);

    let receivedToken: string | null = null;

    if (typeof data === "string") receivedToken = data;
    else if (data?.token) receivedToken = data.token;
    else if (data?.data?.token) receivedToken = data.data.token;

    if (!receivedToken) {
      throw new Error("No token received from login");
    }

    setToken(receivedToken);

    const decoded = decodeToken(receivedToken);
    if (!decoded) throw new Error("Invalid token");

    return decoded;
  }

  // ✅ REGISTER
  async function register(payload: any) {
    return authApi.register(payload);
  }

  // ✅ LOGOUT (FINAL FIX 🔥)
  function logout(redirectTo?: string) {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);

    // 🔥 Force navigation (solves your admin issue)
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}