import React, { useState, useEffect, useContext } from "react";
import { getFeedItems } from "../services/feedService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DownloadButton from "../components/DownloadButton";
import { IMAGE_URL } from "../config/apiConfig";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageInput, setPageInput] = useState(""); // Input for page jumping
  const itemsPerPage = 9;

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
      toast.error("⚠️ Error loading feed items. Please try again.", {
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
      setFirstLoad(false);
    }
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const jumpToPage = (e) => {
    e.preventDefault();
    let pageNumber = parseInt(pageInput, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      toast.error(`⚠️ Page number must be between 1 and ${totalPages}`);
    }
    setPageInput("");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {!isLoading && items.length === 0 && (
          <div className="text-center text-gray-500">
            <p className="text-lg">No data available.</p>
            <p className="text-sm">Please check back later.</p>
          </div>
        )}

        {/* ✅ Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-7xl">
          {isLoading && firstLoad
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="bg-white p-4 shadow rounded-lg">
                  <Skeleton height={160} className="w-full rounded-md" />
                  <Skeleton width="80%" height={24} className="mt-2" />
                  <Skeleton width="100%" count={2} className="mt-1" />
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

                  {/* Metadata */}
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
                      className="mt-3 w-full bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    >
                      Please Login First
                    </button>
                  )}
                </div>
              ))}
        </div>

        {/* ✅ Improved Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-6 space-x-2 items-center">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              First
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Prev
            </button>

            {currentPage > 2 && <span className="px-2">...</span>}

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md transition ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            {currentPage < totalPages - 1 && <span className="px-2">...</span>}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Last
            </button>

            {/* ✅ Jump to Page Input */}
            <form onSubmit={jumpToPage} className="flex items-center ml-4">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={handlePageInput}
                className="w-16 px-2 py-1 text-center border rounded-md bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                placeholder="Page"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
