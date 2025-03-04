import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

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
      let token = Cookies.get("jwt") || localStorage.getItem("jwt");

      if (!token) {
        console.warn("🚨 No JWT token found. Redirecting to login.");
        logout();
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Ensure credentials are included
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
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
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("🔹 Login Successful:", data);

      // ✅ Store JWT properly in both Cookies & LocalStorage
      if (data.token) {
        Cookies.set("jwt", data.token, { secure: true, sameSite: "Strict" });
        localStorage.setItem("jwt", data.token);
      } else {
        console.warn("🚨 Warning: No JWT received in login response!");
      }

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
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("🚨 Logout error:", error.message);
    }

    setAdmin(null);
    Cookies.remove("jwt");
    localStorage.removeItem("jwt"); // ✅ Ensure JWT is fully removed
    toast.info("🚪 Logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
