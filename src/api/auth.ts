import axiosInstance from './axios';
import api from './axios';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string; // Made strictly matching database type constraints
  address?: string;    // 🚀 INJECTED ALL EXTENDED PROPERTIES SAFELY
  pincode?: string;
  alternatePhone?: string;
  adminRole?: boolean; 
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Register API
export async function register(payload: RegisterPayload) {
  const res = await api.post('/auth/register', payload);
  return res.data;
}

// Login API
export async function login(payload: LoginPayload) {
  const res = await api.post('/auth/login', payload);
  return res.data; // expected: { token: "..." } or just token
}

