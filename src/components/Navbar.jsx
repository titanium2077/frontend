import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import DownloadLimit from "../components/DownloadLimit";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // ✅ Redirect to home after logout
  };

  return (
    <nav className="w-full bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* ✅ App Title */}
        <a href="/">
          <h1 className="text-xl font-bold">Kawaiee</h1>
        </a>

        {/* ✅ User Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* ✅ Show Download Limit */}
            <div className="flex items-center bg-gray-700 px-3 py-1 rounded-md">
              <span className="text-green-400 font-semibold text-sm">
                💾 <DownloadLimit limit={user.downloadLimit} />
              </span>
            </div>

            {/* ✅ Buy Storage Button (Always Visible) */}
            <button
              onClick={() => navigate("/payment")}
              className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              ➕ Buy Storage
            </button>

            {/* ✅ Profile Avatar */}
            <a
              href="/profile"
              className="relative w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center hover:ring-2 ring-blue-500"
            >
              <span className="text-white text-sm font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </a>

            {/* ✅ Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
