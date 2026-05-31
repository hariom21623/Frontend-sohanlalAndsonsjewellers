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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    return (t && !isTokenExpired(t)) ? decodeToken(t) : null;
  });

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t || isTokenExpired(t)) {
      setToken(null);
      setUser(null);
    } else {
      setUser(decodeToken(t));
    }
  }, [token]);

  async function login(payload: LoginArgs): Promise<User> {
    const data = await authApi.login(payload);
    const receivedToken = typeof data === "string" ? data : (data?.token || data?.data?.token);
    if (!receivedToken) throw new Error("No token received");
    
    localStorage.setItem(TOKEN_KEY, receivedToken);
    setToken(receivedToken);
    const decoded = decodeToken(receivedToken);
    if (!decoded) throw new Error("Invalid token");
    return decoded;
  }

  // ✅ Fixed: Register function added
  async function register(payload: any) {
    return await authApi.register(payload);
  }

  function logout(redirectTo: string = "/") {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.replace(redirectTo);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}