import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginAdmin, logoutUser, getAuthenticatedUser } from "../../services/authService";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // ✅ Import js-cookie

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
      const response = await getAuthenticatedUser();

      // ✅ Ensure only admins can access
      if (response.user.role === "admin") {
        setAdmin(response.user);
      } else {
        toast.error("Access Denied! Admins only.");
        logout();
      }
    } catch (error) {
      console.error("Admin authentication failed");
      setAdmin(null);
      
      // ✅ Clear cookies when session expires
      Cookies.remove("jwt");
      Cookies.remove("deviceToken");
      
      toast.warning("Session expired! Please log in again.");
      navigate("/admin/login"); // ✅ Secure redirect
    }
  };

  const login = async (adminData) => {
    try {
      const response = await loginAdmin(adminData);
      
      // ✅ Prevent normal users from logging into the admin panel
      if (response.user.role !== "admin") {
        toast.error("Access Denied! This login is for admins only. ❌");
        return;
      }

      setAdmin(response.user);
      toast.success("Admin login successful! 🎉");
      navigate("/admin/dashboard"); // ✅ Redirect on success
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed! ❌");
    }
  };

  const logout = () => {
    logoutUser();
    setAdmin(null);

    // ✅ Remove authentication cookies
    Cookies.remove("jwt");
    Cookies.remove("deviceToken");

    toast.info("Admin logged out successfully!");
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
