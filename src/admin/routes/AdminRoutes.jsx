import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ManageFeed from "../pages/ManageFeed";
import AdminLogin from "../pages/AdminLogin";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* 🔹 Admin Login (Public Route) */}
      <Route path="/login" element={<AdminLogin />} />

      {/* 🔒 Protected Admin Routes */}
      <Route
        path="/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manage-feed" element={<ManageFeed />} />
      </Route>
    </Routes>
  );
}

