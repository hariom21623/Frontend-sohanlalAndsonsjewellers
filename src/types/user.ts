// src/types/user.ts
export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  adminRole?: boolean;
  iat?: number;
  exp?: number;
};
