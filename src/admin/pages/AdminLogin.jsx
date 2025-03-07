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
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessKey = queryParams.get("key");

    // ✅ Check if the key matches the ENV key
    if (accessKey === ADMIN_ACCESS_KEY) {
      Cookies.set("admin_access", "granted", {
        expires: 1 / 6,
        secure: true,
        sameSite: "Strict",
      });
    } else {
      const storedAccess = Cookies.get("admin_access");
      if (storedAccess !== "granted") {
        toast.error("🚫 Unauthorized access!");
        setDenied(true);
        setTimeout(() => navigate("/"), 5000);
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

    let deviceToken = localStorage.getItem("deviceToken");
    if (!deviceToken) {
      deviceToken = crypto.randomUUID();
      localStorage.setItem("deviceToken", deviceToken);
    }

    await login({ email, password, deviceToken });
  };

  // 🔒 No Permission Page
  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 text-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🚫 Access Denied!
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            You do not have permission to access this page.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Redirecting to home in 5 seconds...
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Admin Panel 🚀
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Secure Login Required
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
