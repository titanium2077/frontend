import { useState, useContext, useEffect } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // ✅ Import js-cookie
import { ADMIN_ACCESS_KEY } from "../../config/apiConfig";

export default function AdminLogin() {
  const { admin, login } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessKey = queryParams.get("key");

    // ✅ Check if the key matches the ENV key
    if (accessKey === ADMIN_ACCESS_KEY) {
      // ✅ Set cookie for admin access with 10-minute expiration
      Cookies.set("admin_access", "granted", {
        expires: 1 / 6,
        secure: true,
        sameSite: "Strict",
      });
      setAuthorized(true);
    } else {
      const storedAccess = Cookies.get("admin_access");
      if (storedAccess !== "granted") {
        toast.error("🚫 Unauthorized access!");
        setDenied(true); // Show "No Permission" page
        setTimeout(() => navigate("/"), 5000); // Redirect after 5 sec
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  // 🔒 Show "No Permission" Page if Access is Denied
  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🚫 Access Denied!
          </h1>
          <p className="text-gray-700">
            You do not have permission to access this page.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Redirecting to home in 5 seconds...
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Admin Panel
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
