import { useState } from "react";
import axios from "axios";
import { ADMIN_UPLOAD } from "../../config/apiConfig";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${ADMIN_UPLOAD}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload successful!");
      setFile(null);
      onUploadSuccess();
    } catch (error) {
      alert("Upload failed!");
      //console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-2">Upload ZIP File</h2>
      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="block w-full bg-gray-700 text-white rounded p-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
