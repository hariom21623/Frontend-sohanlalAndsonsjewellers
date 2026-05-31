import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ScrollToTop from "./components/Users/Banner/ScrollToTop";
import WishlistPage from "./routes/WishlistPage";

// Auth
import { useAuth } from "./contexts/AuthProvider";

// Public Pages
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import UserHome from "./routes/UserHome";

// User
import ProductDetails from "./routes/ProductDetails";
import CollectionLanding from "./routes/CollectionLanding";

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
import OrderList from "./routes/Admin/OrderList";
import CheckoutPage from "./components/Users/Cart/CheckoutPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import MyOrders from "./routes/MyOrders";
import MyProfile from "./routes/MyProfile";
import Notifications from "./routes/Notifications";

export default function App() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Auth load hone tak wait karo taaki redirect loop na bane
  useEffect(() => {
    setLoading(false);
  }, [token]);

  if (loading) return null;

  return (
    <>
      <PWAInstallPrompt />
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} style={{ top: '50%', transform: 'translateY(-50%)' }} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />

        {/* ROOT REDIRECTOR: Logic set for Admin vs User */}
        <Route path="/" element={
          !token ? (
            <UserHome /> // Logout hone par sabko UserHome dikhe
          ) : (
            user?.adminRole ? <Navigate to="/admin/users" replace /> : <UserHome />
          )
        } />

        {/* USER ROUTES */}
        <Route path="/user" element={<UserHome />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/collection/:name" element={<CollectionLanding />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ADMIN ROUTES - Protected with Role check */}
        <Route path="/admin/users" element={user?.adminRole ? <UserList /> : <Navigate to="/" replace />} />
        <Route path="/admin/users/create" element={user?.adminRole ? <UserCreate /> : <Navigate to="/" replace />} />
        <Route path="/admin/users/edit/:id" element={user?.adminRole ? <UserEdit /> : <Navigate to="/" replace />} />
        
        <Route path="/admin/products" element={user?.adminRole ? <ProductList /> : <Navigate to="/" replace />} />
        <Route path="/admin/products/create" element={user?.adminRole ? <ProductCreate /> : <Navigate to="/" replace />} />
        <Route path="/admin/products/edit/:id" element={user?.adminRole ? <ProductEdit /> : <Navigate to="/" replace />} />
        
        <Route path="/admin/bills" element={user?.adminRole ? <BillList /> : <Navigate to="/" replace />} />
        <Route path="/admin/bills/create" element={user?.adminRole ? <BillCreate /> : <Navigate to="/" replace />} />
        <Route path="/admin/bills/edit/:id" element={user?.adminRole ? <BillEdit /> : <Navigate to="/" replace />} />
        <Route path="/admin/bills/view/:id" element={user?.adminRole ? <BillView /> : <Navigate to="/" replace />} />
        <Route path="/admin/orders" element={user?.adminRole ? <OrderList /> : <Navigate to="/" replace />} />

        {/* PROTECTED USER ROUTES */}
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}