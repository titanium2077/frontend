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
      const token = Cookies.get("jwt");
      if (!token) {
        console.warn("🚨 No JWT token found.");
        logout();
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (data.user.role === "admin") {
        setAdmin(data.user);
      } else {
        toast.error("Access Denied! Admins only.");
        logout();
      }
    } catch (error) {
      console.warn("🚨 Admin authentication failed:", error.message);
      logout();
    }
  };

  const login = async (adminData) => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error("Admin login failed");
      }

      const data = await response.json();

      // ✅ Prevent normal users from logging into the admin panel
      if (data.user.role !== "admin") {
        toast.error("Access Denied! This login is for admins only. ❌");
        return;
      }


      Cookies.set("jwt", data.token, { secure: true, sameSite: "Strict" });

      setAdmin(data.user);
      toast.success("Admin login successful! 🎉");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Admin login failed! ❌");
    }
  };

  const logout = () => {
    fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", 
    });

    setAdmin(null);
    Cookies.remove("jwt");
    toast.info("Admin logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};