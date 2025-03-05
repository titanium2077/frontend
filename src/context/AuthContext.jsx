import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      console.log("🔄 Fetching user...");

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Send cookies with request
        headers: { "Content-Type": "application/json" }, // ✅ FIXED
      });

      if (!response.ok) {
        throw new Error("User authentication failed");
      }

      const data = await response.json();
      console.log("✅ User fetched:", data.user);
      setUser(data.user);
    } catch (error) {
      console.warn("🚨 User authentication failed", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, navigate) => {
    try {
      console.log("🔄 Logging in user...");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // ✅ Send cookies with request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      console.log(
        "✅ JWT is stored in HttpOnly cookie (Cannot be accessed by frontend)"
      );

      setUser(data.user);
      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (error) {
      toast.error("Login failed! ❌");
    }
  };

  const logout = async (navigate) => {
    try {
      console.log("🔄 Logging out...");
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ Ensures cookies are cleared on logout
        headers: { "Content-Type": "application/json" }, // ✅ FIXED
      });

      setUser(null);
      toast.info("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};