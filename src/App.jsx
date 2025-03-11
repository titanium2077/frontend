import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatSupport from "./components/ChatSupport"; 
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import AdminRoutes from "./admin/routes/AdminRoutes"; // ✅ Admin Routes
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin"); // ✅ Detect Admin Pages

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAdminPage && <Navbar />} {/* ✅ Hide Navbar in Admin Panel */}
      <Routes>
        {/* ✅ Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Home />} />
        
        {/* ✅ Protected Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ✅ Payment Routes */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* ✅ Admin Routes (No Navbar) */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatSupport />}
    </>
  );
}
