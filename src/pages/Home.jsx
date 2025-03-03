import React, { useState, useEffect, useContext } from "react";
import { getFeedItems } from "../services/feedService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toast CSS
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DownloadButton from "../components/DownloadButton"; // ✅ Import component
import { IMAGE_URL } from "../config/apiConfig";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedItems();
  }, [currentPage]);

  const fetchFeedItems = async () => {
    try {
      if (firstLoad) setIsLoading(true);
      const data = await getFeedItems(currentPage, itemsPerPage);
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      //console.error("🚨 Error fetching feed items:", error);
      toast.error("⚠️ Error loading feed items. Please try again.", {
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
      setFirstLoad(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* ✅ No Data Case */}
        {!isLoading && items.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="text-lg">No data available.</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        )}

        {/* ✅ Feed Items List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-6xl">
          {isLoading && firstLoad
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="bg-white p-4 shadow rounded-lg">
                  <Skeleton height={160} className="w-full rounded-md" />
                  <Skeleton width="80%" height={24} className="mt-2" />
                  <Skeleton width="100%" count={2} className="mt-1" />
                  <div className="mt-3 text-sm">
                    <Skeleton width="60%" height={16} />
                    <Skeleton width="50%" height={16} />
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="30%" height={16} />
                  </div>
                  <Skeleton
                    width={120}
                    height={40}
                    className="mt-3 rounded-md"
                  />
                </div>
              ))
            : items.map((item) => (
                <div key={item._id} className="bg-white p-4 shadow rounded-lg">
                  <img
                    src={`${IMAGE_URL}${item.image}`}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h2 className="text-gray-800 text-lg font-semibold mt-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>

                  {/* Display Metadata */}
                  <div className="mt-3 text-sm text-gray-700">
                    <p>
                      <strong>Resolution:</strong> {item.resolution}
                    </p>
                    <p>
                      <strong>Duration:</strong> {item.duration}
                    </p>
                    <p>
                      <strong>File Type:</strong> {item.fileType}
                    </p>
                    <p>
                      <strong>File Size:</strong> {item.fileSize}
                    </p>
                  </div>

                  {/* Download Button */}
                  {user ? (
                    <DownloadButton
                      fileId={item._id}
                      userLimit={user.downloadLimit}
                    />
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="mt-3 inline-block bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    >
                      Please Login First
                    </button>
                  )}
                </div>
              ))}
        </div>

        {/* ✅ Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex mt-6 space-x-2 items-center">
            {/* First Button */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              First
            </button>

            {/* Numbered Pagination */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md transition ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Last Button */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
