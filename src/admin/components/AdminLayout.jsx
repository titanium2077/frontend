import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ✅ Sidebar - Hidden on small screens */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ✅ Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Top Bar for Mobile */}
        <div className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 dark:text-white text-2xl"
          >
            <FiMenu />
          </button>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        {/* ✅ Page Content */}
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
