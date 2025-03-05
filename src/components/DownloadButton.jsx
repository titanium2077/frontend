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
    toast.info("📥 Generating secure download link...", { autoClose: 2000 });
  
    try {
      // ✅ Step 1: Generate Secure Token
      const response = await axios.get(`${FEED_URL_DOWNLOAD}/${fileId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      const { downloadToken, secureDownloadUrl } = response.data;
  
      if (!downloadToken) throw new Error("Download token missing!");
  
      console.log("✅ Secure Token Received:", downloadToken);
  
      // ✅ Step 2: Verify Secure Token Before Download
      const verifyResponse = await axios.get(secureDownloadUrl, {
        headers: { "Content-Type": "application/json" },
      });
  
      const { downloadUrl, fileName, fileSize } = verifyResponse.data;
  
      console.log(`✅ File Verified: ${fileName} (${fileSize})`);
  
      // ✅ Step 3: Start Download
      window.open(downloadUrl, "_blank");
  
      toast.success(`✅ Download started: ${fileName}`, { autoClose: 3000 });
  
    } catch (error) {
      console.error("🚨 Download Error:", error.response?.data || error.message);
      toast.error(`⚠️ ${error.response?.data?.message || "Failed to download file"}`, { autoClose: 4000 });
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
      {isDownloading ? "⏳ Downloading..." : "⬇️ Secure Download"}
    </button>
  );
}
