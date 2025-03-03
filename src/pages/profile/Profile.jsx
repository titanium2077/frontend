import { useState, useEffect, useContext } from "react";
import { getUserProfile } from "../../services/profileService";
import { AuthContext } from "../../context/AuthContext";
import DownloadLimit from "../../components/DownloadLimit"; // ✅ Import the component

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error(
        "🚨 Error fetching profile:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400">
          User Profile
        </h1>

        {profile ? (
          <div className="mt-6 space-y-4">
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
        ) : (
          <div className="flex justify-center mt-6">
            <p className="text-gray-400 animate-pulse">Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}
