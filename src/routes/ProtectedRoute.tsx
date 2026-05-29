import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: any) {
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!token && !localStorage.getItem("toast_shown")) {
      toast.info("Please login to continue!");
      localStorage.setItem("toast_shown", "true"); // Flag set karo
      // Thodi der baad flag hata do taaki next time phir dikhe
      setTimeout(() => localStorage.removeItem("toast_shown"), 5000);
    }
  }, [token]);

  return token ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}