import axios from "axios";
import { toast } from "react-toastify";
import { IMAGE_URL, FEED_URL } from "../../config/apiConfig";

// eslint-disable-next-line react/prop-types
export default function FeedTable({ feedItems, fetchFeedItems, setSelectedItem, setIsFormOpen }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${FEED_URL}/${id}`, { withCredentials: true });
        fetchFeedItems();
        toast.success("✅ Item deleted successfully!", { autoClose: 3000 });
      } catch (error) {
        toast.error("❌ Failed to delete item. Please try again.", { autoClose: 3000 });
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
            <th className="p-3">Resolution</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-400">
                No feed items found.
              </td>
            </tr>
          ) : (
            feedItems.map((item) => (
              <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                <td className="p-3">
                  <img
                    src={item.image ? `${IMAGE_URL}${item.image}` : "/placeholder.png"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.resolution}</td>
                <td className="p-3 flex gap-3">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsFormOpen(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
