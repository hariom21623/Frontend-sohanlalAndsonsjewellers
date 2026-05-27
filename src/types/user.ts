// src/types/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string; // ✅ Add this
  pincode?: string; // ✅ Add this
  adminRole?: boolean;
  iat?: number;
  exp?: number;
};
