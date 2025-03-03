import { Link } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

export default function Sidebar() {
  const { logout } = useContext(AdminAuthContext);

  return (
    <div className="w-64 bg-gray-800 p-5 min-h-screen">
      <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
      <nav className="mt-4">
        <ul>
          <li className="mb-2">
            <Link to="/admin/dashboard" className="text-white hover:text-blue-400">
              📊 Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/manage-feed" className="text-white hover:text-blue-400">
              📂 Manage Feeds
            </Link>
          </li>
          <li className="mt-4">
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
