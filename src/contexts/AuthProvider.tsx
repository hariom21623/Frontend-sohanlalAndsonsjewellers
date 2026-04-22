// src/contexts/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { decodeToken, isTokenExpired } from "../utils/jwt";
import * as authApi from "../api/auth";
import type { User } from "../types/user";

/** Key used in localStorage */
const TOKEN_KEY = "sls_token";

type LoginArgs = { email: string; password: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (payload: LoginArgs) => Promise<User>;
  register: (payload: any) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t && !isTokenExpired(t)) return decodeToken(t);
    return null;
  });

  // keep localStorage & user in sync when token changes
  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const decoded = decodeToken(token);
        setUser(decoded);
        localStorage.setItem(TOKEN_KEY, token);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  // login returns decoded user so callers can immediately use it
  async function login(payload: LoginArgs): Promise<User> {
    const data = await authApi.login(payload);

    // backend might return:
    // { token: '...' } or { token: '...', user: {...} } or raw token string
    let receivedToken: string | null = null;
    if (typeof data === "string") {
      receivedToken = data;
    } else if (data?.token) {
      receivedToken = data.token;
    } else if (data?.data?.token) {
      // sometimes nested
      receivedToken = data.data.token;
    }

    if (!receivedToken) {
      throw new Error("No token received from login");
    }

    // set token -> effect will decode & set user
    setToken(receivedToken);

    // decode immediately and return user object
    const decoded = decodeToken(receivedToken);
    if (!decoded) throw new Error("Failed to decode token");
    return decoded;
  }

  async function register(payload: any) {
    return authApi.register(payload);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
