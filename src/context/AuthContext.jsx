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
      let jwt = localStorage.getItem("jwt");
      let deviceToken = localStorage.getItem("deviceToken");

      if (!jwt || !deviceToken) {
        console.warn("🚨 No JWT or Device Token Found!");
        setUser(null);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Send cookies
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
          "X-Device-Token": deviceToken,
        },
      });

      if (!response.ok) {
        throw new Error("User authentication failed");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, navigate) => {
    try {
      let deviceToken = localStorage.getItem("deviceToken");
      if (!deviceToken) {
        deviceToken = crypto.randomUUID();
        localStorage.setItem("deviceToken", deviceToken);
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, deviceToken }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("jwt", data.token); // Store JWT in local storage
      setUser(data.user);
      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (error) {
      toast.error("Login failed! ❌");
    }
  };

  const logout = async (navigate) => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("jwt");
      localStorage.removeItem("deviceToken");
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
