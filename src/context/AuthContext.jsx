import { createContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getAuthenticatedUser } from "../services/authService";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getAuthenticatedUser();
      setUser(response.user);
    } catch (error) {
      //console.error("User authentication failed", error);
      setUser(null);
    } finally {
      setLoading(false); // ✅ Ensure loading state is updated
    }
  };

  const login = async (userData, navigate) => {
    try {
      const response = await loginUser(userData);

      if (response.user.role === "admin") {
        toast.error("Access denied! Use the Admin Login page ❌");
        return;
      }

      setUser(response.user);
      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed! ❌");
    }
  };

  const logout = async (navigate) => {
    try {
      await logoutUser();
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
