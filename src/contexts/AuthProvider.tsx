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
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return;
    }
    setUser(decodeToken(token));
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

  async function register(payload: any) { return authApi.register(payload); }

  function logout(redirectTo: string = "/") {
    localStorage.removeItem("sls_token");
    localStorage.removeItem("sls_wishlist");
    localStorage.removeItem("login_toast_shown");
    setToken(null);
    setUser(null);

    // 🔥 Isse browser cache ignore karega aur naye headers ke saath load hoga
    window.location.replace(redirectTo);
    window.location.reload();
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