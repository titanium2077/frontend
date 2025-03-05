import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      fetchAdmin();
    }
  }, [location.pathname]);

  const fetchAdmin = async () => {
    try {
      console.log("🔄 Fetching admin user...");

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Send cookies with request
        headers: { "Content-Type": "application/json" }, // ✅ FIXED
      });

      if (!response.ok) {
        throw new Error("Session expired or unauthorized access.");
      }

      const data = await response.json();
      setAdmin(data.user);
    } catch (error) {
      console.warn("🚨 Admin authentication failed:", error.message);
      logout();
    }
  };

  const login = async ({ email, password }) => {
    try {
      let deviceToken = localStorage.getItem("deviceToken");
      if (!deviceToken) {
        deviceToken = crypto.randomUUID();
        localStorage.setItem("deviceToken", deviceToken);
      }

      const res = await fetch(`${API_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, deviceToken }),
        credentials: "include", // ✅ Ensures JWT is stored in cookies
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log(
        "✅ JWT is stored in HttpOnly cookie (Cannot be accessed by frontend)"
      );

      setAdmin(data.user);
      navigate("/admin/dashboard");
      toast.success("✅ Login successful!");
      return data;
    } catch (error) {
      console.error("🚨 Login Error:", error.message);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      console.log("🔄 Logging out...");
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ Ensures cookies are cleared on logout
        headers: { "Content-Type": "application/json" }, // ✅ FIXED
      });
    } catch (error) {
      console.warn("🚨 Logout error:", error.message);
    }

    setAdmin(null);
    toast.info("🚪 Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};