import { FiSend } from "react-icons/fi";

export default function ReplyInput({ reply, setReply, handleReply, loading }) {
  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-800 w-full md:relative md:rounded-b-lg">
      <input
        type="text"
        placeholder="Type your reply..."
        className="flex-1 p-3 rounded-lg bg-gray-600 text-white focus:outline-none shadow-sm"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        onClick={handleReply}
        className="bg-green-500 px-5 py-3 rounded-md text-white hover:bg-green-600 flex items-center"
        disabled={loading}
      >
        <FiSend className="mr-2" />
        {loading ? "Replying..." : "Send"}
      </button>
    </div>
  );
}
