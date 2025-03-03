import axios from "axios";
import { toast } from "react-toastify";
import DownloadButton from "../../components/DownloadButton";
import { IMAGE_URL, FEED_URL } from "../../config/apiConfig";

// eslint-disable-next-line react/prop-types
export default function FeedTable({
  feedItems,
  fetchFeedItems,
  setSelectedItem,
  setIsFormOpen,
}) {
  // ✅ Delete Feed Item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${FEED_URL}/${id}`, {
          withCredentials: true,
        });
        fetchFeedItems(); // ✅ Refresh List
        toast.success("✅ Item deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        console.error("🚨 Error deleting feed item", error);
        toast.error("❌ Failed to delete item. Please try again.", {
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900 p-4 rounded-lg shadow-md">
      <table className="w-full bg-gray-800 text-white rounded-lg">
        <thead>
          <tr className="border-b border-gray-600 text-left text-sm uppercase tracking-wider">
            <th className="p-3">Preview</th>
            <th className="p-3">Title</th>
            <th className="p-3">File Size</th>
            <th className="p-3">Resolution</th>
            <th className="p-3">Download</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedItems.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-200"
            >
              {/* ✅ Thumbnail Preview */}
              <td className="p-3">
                <img
                  src={
                    item.image
                      ? `${IMAGE_URL}${item.image}`
                      : "/placeholder.png"
                  }
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-md shadow-md"
                />
              </td>

              {/* ✅ Title */}
              <td className="p-3 font-semibold">{item.title}</td>

              {/* ✅ File Size */}
              <td className="p-3 text-gray-300">{item.fileSize}</td>

              {/* ✅ Resolution */}
              <td className="p-3 text-gray-300">{item.resolution}</td>

              {/* ✅ Download Button (Admin Mode) */}
              <td className="p-3">
                {item.storageKey ? (
                  <DownloadButton fileId={item._id} isAdmin={true} />
                ) : (
                  <span className="text-gray-400">No file</span>
                )}
              </td>

              {/* ✅ Action Buttons */}
              <td className="p-3 flex gap-3">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition-all"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsFormOpen(true);
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition-all"
                  onClick={() => handleDelete(item._id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ No Items Found Message */}
      {feedItems.length === 0 && (
        <p className="text-center text-gray-400 py-4">No feed items found.</p>
      )}
    </div>
  );
}
