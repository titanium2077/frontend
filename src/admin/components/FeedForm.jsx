import { useState, useEffect } from "react";
import axios from "axios";
import { IMAGE_URL, FEED_URL, FEED_URL_CREATE } from "../../config/apiConfig";

export default function FeedForm({ selectedItem, fetchFeedItems, setIsFormOpen }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resolution: "",
    duration: "",
  });

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("/placeholder.png");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || "",
        description: selectedItem.description || "",
        resolution: selectedItem.resolution || "",
        duration: selectedItem.duration || "",
      });

      setPreviewImageUrl(
        selectedItem.image ? `${IMAGE_URL}${selectedItem.image}` : "/placeholder.png"
      );
    }
  }, [selectedItem]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      alert("Please select a ZIP file before submitting.");
      return;
    }

    const allowedZipTypes = ["application/zip", "application/x-zip-compressed", "application/octet-stream"];
    if (!allowedZipTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".zip")) {
      alert("Only ZIP files are allowed!");
      return;
    }

    setFile(selectedFile);
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];

    if (!image?.type.startsWith("image/")) {
      setErrorMessage("Only image files are allowed.");
      return;
    }

    setErrorMessage("");
    setPreviewImage(image);

    const reader = new FileReader();
    reader.onload = (event) => setPreviewImageUrl(event.target.result);
    reader.readAsDataURL(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !selectedItem) {
      alert("Please select a ZIP file before submitting.");
      return;
    }

    if (!previewImage && !selectedItem) {
      alert("Please select an image before submitting.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );

      if (file) formDataToSend.append("file", file);
      if (previewImage) formDataToSend.append("image", previewImage);

      const apiUrl = selectedItem ? `${FEED_URL}/${selectedItem._id}` : FEED_URL_CREATE;
      const method = selectedItem ? "put" : "post";

      await axios[method](apiUrl, formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchFeedItems();
      setIsFormOpen(false);
    } catch (error) {
      console.error("🚨 Error saving feed item:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-900 p-6 rounded-md w-full max-w-lg shadow-lg relative animate-fadeIn">
        
        {/* 🔹 Close Button */}
        <button
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
          onClick={() => setIsFormOpen(false)}
        >
          ✕
        </button>

        {/* 🔹 Form Title */}
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedItem ? "Edit Feed Item" : "Add New Feed Item"}
        </h2>

        {/* 🔹 Error Message */}
        {errorMessage && <p className="text-red-400 mb-2">{errorMessage}</p>}

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
              className="p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
              className="p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold">Resolution</label>
              <input
                type="text"
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                placeholder="1080p, 4K etc."
                required
                className="p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-white font-semibold">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 2m30s"
                required
                className="p-2 w-full rounded bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* 🔹 Image Upload */}
          <div>
            <label className="text-white font-semibold">Preview Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 w-full rounded bg-gray-700 text-white"
            />
            <img
              src={previewImageUrl}
              alt="Preview"
              className="w-full h-32 object-cover mt-2 rounded-md"
            />
          </div>

          {/* 🔹 ZIP File Upload */}
          <div>
            <label className="text-white font-semibold">Upload ZIP File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 w-full rounded bg-gray-700 text-white"
            />
          </div>

          {/* 🔹 Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-green-500 px-4 py-2 rounded-md text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Uploading..." : selectedItem ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
