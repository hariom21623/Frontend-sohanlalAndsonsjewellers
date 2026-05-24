import React, { useEffect } from "react"; 
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

export default function App() {
  const { token, user } = useAuth();

  // 🔒 🚀 FRONT-END FORTRESS SECURITY PROTOCOLS WITH SMART BYPASS
  useEffect(() => {
    // 🚀 DYNAMIC BYPASS CHECK: Agar hostname localhost hai, toh dynamic restrictions skip kardo!
    if (window.location.hostname === 'localhost' || process.env.NODE_ENV === 'development') {
      console.log("🔓 [SLS DEV MODE ACTIVE]: Right-click and developer tools are unlocked for debugging sessions.");
      return; // Stops executing block conditions below immediately!
    }

    // 1. Blocks right-click option completely across the platform
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Terminate aggressive inspector keystroke shortcuts
    const preventInspectKeys = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || // F12 Developer Tools entry
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || // Inspect / Console elements
        (e.ctrlKey && e.key === "u") // View Page Source
      ) {
        e.preventDefault();
      }
    };

    // Mount listeners safely on active component rendering tree
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventInspectKeys);

    // Clean listeners when node shifts to drop performance leaks
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventInspectKeys);
    };
  }, []);

  // ======================================================================
  // 🔒 HARDCORE RAW METHOD METHOD (Aap ise baad me uncomment kar sakte hain)
  // ======================================================================
  // useEffect(() => {
  //   const preventContextMenu = (e: MouseEvent) => e.preventDefault();
  //   const preventInspectKeys = (e: KeyboardEvent) => {
  //     if (
  //       e.key === "F12" || 
  //       (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || 
  //       (e.ctrlKey && e.key === "u")
  //     ) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("contextmenu", preventContextMenu);
  //   document.addEventListener("keydown", preventInspectKeys);
  //   return () => {
  //     document.removeEventListener("contextmenu", preventContextMenu);
  //     document.removeEventListener("keydown", preventInspectKeys);
  //   };
  // }, []);
  // ======================================================================
  

  return (
    <>
      <PWAInstallPrompt />
      
      {/* Global Scroll To Top Trigger */}
      <ScrollToTop />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= USER ================= */}
        <Route path="/" element={<UserHome />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/collection/:name" element={<CollectionLanding />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ================= ADMIN ================= */}
        {/* USERS */}
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/create" element={<UserCreate />} />
        <Route path="/admin/users/edit/:id" element={<UserEdit />} />

        {/* PRODUCTS */}
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/create" element={<ProductCreate />} />
        <Route path="/admin/products/edit/:id" element={<ProductEdit />} />

        {/* BILLS */}
        <Route path="/admin/bills" element={<BillList />} />
        <Route path="/admin/bills/create" element={<BillCreate />} />
        <Route path="/admin/bills/edit/:id" element={<BillEdit />} />
        <Route path="/admin/bills/view/:id" element={<BillView />} />

        {/* ================= ROOT ================= */}
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

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}