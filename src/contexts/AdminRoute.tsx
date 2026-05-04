import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function AdminRoute({ children }: any) {
  const { token, user } = useAuth();

  // ❌ No token → kick to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin → kick to user home
  if (!user || user.adminRole !== true) {
    return <Navigate to="/user" replace />;
  }

  // ✅ Admin allowed
  return children;
}