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

  const fetchFeedItems = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`${FEED_URL}?page=${page}`);
      setFeedItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching feed items", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
        Manage Feed Items
      </h1>

      {/* 🔹 Feed Overview & Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Feed Items" value={feedItems.length} />
        <StatCard title="Pages Available" value={totalPages} />
        <StatCard title="Current Page" value={currentPage} />
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="bg-green-500 px-5 py-3 rounded-md w-full sm:w-auto"
        >
          + Add New Feed Item
        </button>
      </div>

      {/* 🔹 Feed Table (Now scrolls properly on mobile) */}
      <div className="overflow-x-auto w-full">
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
      </div>

      {/* 🔹 Pagination Controls */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 🔹 Add/Edit Form Popup */}
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

// 🔹 Stats Card Component
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
