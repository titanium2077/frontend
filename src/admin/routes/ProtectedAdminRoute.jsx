import { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // ✅ Import js-cookie
import { toast } from "react-toastify";

export default function ProtectedAdminRoute({ children }) {
  const { admin } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Set loading to true while checking authentication
    setLoading(true);

    // ✅ Check if user is authenticated as admin
    if (admin === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    // ✅ If no admin found, redirect to login and clear cookies
    if (!admin && !loading) {
      Cookies.remove("jwt");
      Cookies.remove("deviceToken"); // ✅ Ensure device token is also removed
      toast.error("Session expired or unauthorized access! Redirecting to login...");
      navigate("/admin/login"); // ✅ Secure redirect
    }
  }, [admin, navigate, loading]);

  if (loading) {
    return <div className="text-center text-white mt-10">🔒 Checking access...</div>;
  }

  return admin ? children : null;
}
