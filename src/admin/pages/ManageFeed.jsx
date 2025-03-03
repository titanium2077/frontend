import { useEffect, useState } from "react";
import axios from "axios";
import FeedTable from "../components/FeedTable";
import FeedForm from "../components/FeedForm";
import { FEED_URL } from "../../config/apiConfig";

export default function ManageFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchFeedItems(currentPage);
  }, [currentPage]);

  // ✅ Fetch Paginated Feed Items
  const fetchFeedItems = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${FEED_URL}?page=${page}`);
      setFeedItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      //console.error("Error fetching feed items", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Feed Items</h1>

      {/* Add New Item Button */}
      <button
        onClick={() => {
          setSelectedItem(null);
          setIsFormOpen(true);
        }}
        className="mb-4 bg-green-500 px-4 py-2 rounded-md"
      >
        + Add New Feed Item
      </button>

      {/* Feed Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <FeedTable
          feedItems={feedItems}
          fetchFeedItems={fetchFeedItems}
          setSelectedItem={setSelectedItem}
          setIsFormOpen={setIsFormOpen}
        />
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-700 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {/* Add/Edit Form Popup */}
      {isFormOpen && (
        <FeedForm
          selectedItem={selectedItem}
          fetchFeedItems={fetchFeedItems}
          setIsFormOpen={setIsFormOpen}
        />
      )}
    </div>
  );
}
