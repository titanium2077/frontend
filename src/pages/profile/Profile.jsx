import { useState, useEffect, useContext } from "react";
import { getUserProfile } from "../../services/profileService";
import { AuthContext } from "../../context/AuthContext";
import DownloadLimit from "../../components/DownloadLimit"; // ✅ Import Download Limit Component

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      
      console.log("🔹 API Response:", response.data);
  
      setProfile(response.data.user);
      setTransactions(response.data.transactions || []);
      setDownloads(response.data.downloads || []);
    } catch (error) {
      console.error("🚨 Error fetching profile:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          User Profile
        </h1>

        {profile ? (
          <>
            {/* 🔹 User Info Section */}
            <div className="mb-6 space-y-4">
              <div className="border-b border-gray-700 pb-2">
                <p className="text-lg font-semibold text-gray-300">👤 Name</p>
                <p className="text-gray-400">{profile.name}</p>
              </div>
              <div className="border-b border-gray-700 pb-2">
                <p className="text-lg font-semibold text-gray-300">📧 Email</p>
                <p className="text-gray-400">{profile.email}</p>
              </div>
              <div className="border-b border-gray-700 pb-2">
                <p className="text-lg font-semibold text-gray-300">
                  ⬇️ Download Limit
                </p>
                <p className="text-gray-400">
                  <DownloadLimit limit={profile.downloadLimit} />
                </p>
              </div>
              <div className="border-b border-gray-700 pb-2">
                <p className="text-lg font-semibold text-gray-300">
                  📂 Total Downloads
                </p>
                <p className="text-gray-400">
                  <DownloadLimit limit={profile.totalDownloads} />
                </p>
              </div>
            </div>

            {/* 🔹 Recent Transactions Section */}
            <div className="bg-gray-700 p-4 rounded-md shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-300 mb-3">
                💰 Transaction History
              </h2>
              {transactions.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="p-2">Amount</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-gray-600">
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
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 text-center">No transactions found.</p>
              )}
            </div>

            {/* 🔹 Download History Section */}
            <div className="bg-gray-700 p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold text-gray-300 mb-3">
                📥 Download History
              </h2>
              {downloads.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="p-2">File Name</th>
                      <th className="p-2">Download Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloads.map((file) => (
                      <tr key={file._id} className="border-b border-gray-600">
                        <td className="p-2">{file.fileName || "Unknown File"}</td>
                        <td className="p-2">
                          {new Date(file.downloadDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 text-center">No downloads yet.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-6">
            <p className="text-gray-400 animate-pulse">Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}