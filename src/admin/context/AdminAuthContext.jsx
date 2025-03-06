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
      let jwt = localStorage.getItem("jwt");
      let deviceToken = localStorage.getItem("deviceToken");

      if (!jwt || !deviceToken) {
        console.warn("🚨 No JWT or Device Token Found!");
        setAdmin(null);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          "X-Device-Token": deviceToken,
        },
      });

      if (!response.ok) {
        throw new Error("Session expired or unauthorized access.");
      }

      const data = await response.json();
      setAdmin(data.user);
    } catch (error) {
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

      localStorage.setItem("jwt", data.token);
      setAdmin(data.user);
      navigate("/admin/dashboard");
      toast.success("✅ Login successful!");
      return data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {}

    localStorage.removeItem("jwt");
    localStorage.removeItem("deviceToken");
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
