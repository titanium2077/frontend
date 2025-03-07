import { Link } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { FiX } from "react-icons/fi";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AdminAuthContext);

  return (
    <div
      className={`fixed md:relative bg-gray-800 text-white w-64 h-screen md:h-auto md:block transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* ✅ Close Button (Only Mobile) */}
      <button
        className="absolute top-4 right-4 text-white text-2xl md:hidden"
        onClick={() => setIsOpen(false)}
      >
        <FiX />
      </button>

      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin/dashboard"
                className="block text-white hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-feed"
                className="block text-white hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                📂 Manage Feeds
              </Link>
            </li>
            <li className="mt-6">
              <button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
