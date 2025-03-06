import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_DASHBOARD } from "../../config/apiConfig";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    transactions: [],
    topFeedItems: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const deviceToken = localStorage.getItem("deviceToken");

      const response = await axios.get(ADMIN_DASHBOARD, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
          "X-Device-Token": deviceToken,
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      setStats(response.data);
    } catch (error) {
      console.warn("🚨 Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* 🔹 Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Downloads" value={stats.totalDownloads} />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} />
        <StatCard title="Total Users" value={stats.totalUsers} />
      </div>

      {/* 🔹 Active Users & Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard title="Active Users" value={stats.activeUsers} />

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3">Recent Transactions</h2>
          <table className="w-full text-left bg-gray-700 rounded-md">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                stats.transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-gray-600">
                    <td className="p-2">{tx.user}</td>
                    <td className="p-2">${tx.amount}</td>
                    <td
                      className={`p-2 ${
                        tx.status === "Completed"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.status}
                    </td>
                    <td className="p-2">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Top 5 Most Downloaded Feed Items */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3">Top 5 Most Downloaded Items</h2>
        <table className="w-full text-left bg-gray-700 rounded-md">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2">Title</th>
              <th className="p-2">Downloads</th>
            </tr>
          </thead>
          <tbody>
            {stats.topFeedItems.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-400">
                  No data available.
                </td>
              </tr>
            ) : (
              stats.topFeedItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-600">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">{item.downloadCount} times</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔹 Reusable Stats Card Component
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
