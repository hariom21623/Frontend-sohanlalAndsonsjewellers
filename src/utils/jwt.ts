// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";
import type { User } from "../types/user";

export function decodeToken(token: string): User | null {
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
