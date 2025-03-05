import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FEED_URL_DOWNLOAD } from "../config/apiConfig";

export default function DownloadButton({ fileId, userLimit, isAdmin = false }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!fileId) return toast.error("⚠️ Invalid file ID!");

    setIsDownloading(true);
    toast.info("📥 Generating download link...", { autoClose: 2000 });

    try {
      const response = await axios.get(`${FEED_URL_DOWNLOAD}/${fileId}`, {
        withCredentials: true,
      });
      const { downloadUrl, remainingQuota } = response.data;

      if (!downloadUrl)
        throw new Error("Download link not provided by the server.");

      // ✅ Open the secure link (Triggers file download)
      window.open(downloadUrl, "_blank");

      // ✅ Show new quota if user (Admins don’t have quotas)
      if (!isAdmin) {
        toast.success(
          `✅ Download started! Remaining Quota: ${remainingQuota.toFixed(
            2
          )} GB`,
          { autoClose: 3000 }
        );
      } else {
        toast.success("✅ Admin download started!", { autoClose: 3000 });
      }
    } catch (error) {
      console.error(
        "🚨 Download Error:",
        error.response?.data || error.message
      );
      toast.error(
        `⚠️ ${
          error.response?.data?.message || "Failed to generate download link"
        }`,
        { autoClose: 4000 }
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading || (!isAdmin && userLimit <= 0)}
      className={`mt-3 inline-block px-4 py-2 rounded-md transition ${
        isDownloading
          ? "bg-gray-500 cursor-not-allowed"
          : userLimit <= 0 && !isAdmin
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {isDownloading ? "⏳ Downloading..." : "⬇️ Download"}
    </button>
  );
}