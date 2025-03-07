import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import DownloadLimit from "../components/DownloadLimit";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* ✅ Fixed Navbar */}
      <nav className="w-full bg-gray-800 text-white p-4 fixed top-0 left-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* ✅ Brand Name */}
          <Link to="/" className="text-xl font-bold">
            Kawaiee
          </Link>

          {/* ✅ User Actions */}
          {user ? (
            <div className="relative">
              {/* ✅ User Avatar (Opens Dropdown) */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-gray-600 w-10 h-10 rounded-full justify-center"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {/* ✅ Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg p-4">
                  <p className="text-white text-center font-bold">
                    {user.name}
                  </p>
                  <p className="text-green-400 text-center text-sm">
                    💾 <DownloadLimit limit={user.downloadLimit} />
                  </p>
                  <hr className="my-2 border-gray-700" />

                  <button
                    onClick={() => {
                      navigate("/payment");
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md"
                  >
                    ➕ Buy Storage
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-md"
                  >
                    👤 Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-md"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
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

      {/* ✅ Push Page Content Down */}
      <div className="pt-16"></div>
    </>
  );
}
