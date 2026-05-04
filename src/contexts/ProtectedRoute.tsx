// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function ProtectedRoute({ children }: any) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}