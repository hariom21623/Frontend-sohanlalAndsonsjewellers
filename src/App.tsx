// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import AppHeader from "./components/AppHeader";

// Auth
import { useAuth } from "./contexts/AuthProvider";

// Public Pages
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import UserHome from "./routes/UserHome";

// Admin Pages
import UserList from "./routes/Admin/UserList";
import UserEdit from "./routes/Admin/UserEdit";
import UserCreate from "./routes/Admin/UserCreate";

import ProductList from "./routes/Admin/ProductList";
import ProductCreate from "./routes/Admin/ProductCreate";
import ProductEdit from "./routes/Admin/ProductEdit";

import BillList from "./routes/Admin/BillList";
import BillCreate from "./routes/Admin/BillCreate";
import BillEdit from "./routes/Admin/BillEdit";
import BillView from "./routes/Admin/BillView";

//User Pages
import ProductDetails from "./routes/ProductDetails";

export default function App() {
  const { token, user } = useAuth();

  return (
    <>
      <AppHeader />

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/login"
          element={!token ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route path="/register" element={<RegisterPage />} />

        {/* ---------- USER HOME ---------- */}
        <Route path="/user" element={<UserHome />} />

        {/* ---------- ADMIN ROUTES (TEMPORARILY UNPROTECTED) ---------- */}
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/create" element={<UserCreate />} />
        <Route path="/admin/users/edit/:id" element={<UserEdit />} />

        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<ProductCreate />} />
        <Route path="/admin/products/edit/:id" element={<ProductEdit />} />

        <Route path="/admin/bills" element={<BillList />} />
        <Route path="/admin/bills/create" element={<BillCreate />} />
        <Route path="/admin/bills/edit/:id" element={<BillEdit />} />
        <Route path="/admin/bills/view/:id" element={<BillView />} />

        //User Product Details
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ---------- ROOT REDIRECT ---------- */}
        <Route
          path="/"
          element={
            token ? (
              user?.adminRole ? (
                <Navigate to="/admin/users" replace />
              ) : (
                <Navigate to="/user" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
