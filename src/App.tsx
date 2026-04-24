// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { useAuth } from "./contexts/AuthProvider";

// Pages
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import UserHome from "./routes/UserHome";
import ProductDetails from "./routes/ProductDetails";

// Admin
import UserList from "./routes/Admin/UserList";
import UserCreate from "./routes/Admin/UserCreate";
import UserEdit from "./routes/Admin/UserEdit";

// Protected Routes
import ProtectedRoute from "./contexts/ProtectedRoute";
import AdminRoute from "./contexts/AdminRoute";

export default function App() {
  const { token, user } = useAuth();

  return (
    <>
      <AppHeader />
      <PWAInstallPrompt />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserHome />} />

        {/* PRODUCT (PROTECTED) */}
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users/create"
          element={
            <AdminRoute>
              <UserCreate />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users/edit/:id"
          element={
            <AdminRoute>
              <UserEdit />
            </AdminRoute>
          }
        />

        {/* ROOT */}
        <Route
          path="/"
          element={
            token ? (
              user?.adminRole ? (
                <Navigate to="/admin/users" />
              ) : (
                <Navigate to="/user" />
              )
            ) : (
              <Navigate to="/user" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}