import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // ✅ Import js-cookie

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
      const token = Cookies.get("jwt");
      if (!token) {
        console.warn("🚨 No JWT token found.");
        setUser(null);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("User authentication failed");
      }

      const data = await response.json();
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // ✅ Send cookies with request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // ✅ Store JWT in cookies
      Cookies.set("jwt", data.token, { secure: true, sameSite: "Strict" });

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
        credentials: "include", // ✅ Ensure cookies are cleared on logout
      });

      setUser(null);
      Cookies.remove("jwt");
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
