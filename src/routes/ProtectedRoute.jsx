import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login"); // ✅ Redirect only after checking user status
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="text-center text-gray-400">Checking authentication...</p>; // ✅ Show loading indicator

  return user ? children : null;
}
