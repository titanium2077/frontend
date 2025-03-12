import { FiUsers, FiX } from "react-icons/fi";

export default function UserList({ users, selectedUser, onSelectUser, isFetching, showUserList, setShowUserList }) {
  return (
    <div className="md:w-1/4 lg:w-1/5 flex flex-col h-full">
      {/* ✅ Mobile Toggle Button */}
      <button
        className="md:hidden bg-blue-500 text-white p-2 rounded-md mb-2 flex items-center justify-center w-full"
        onClick={() => setShowUserList(!showUserList)}
      >
        <FiUsers className="mr-2" />
        {showUserList ? "Hide Users" : "📩 View Support Requests"}
      </button>

      {/* ✅ Sidebar - Mobile: Slide-in | Desktop: Fixed */}
      <div
        className={`fixed md:relative top-0 left-0 h-full md:h-auto w-4/5 sm:w-3/5 md:w-full max-w-xs md:max-w-none bg-gray-800 p-4 shadow-lg transition-transform duration-300 ease-in-out z-50 md:z-auto ${
          showUserList ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        {/* ✅ Close Button for Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">📩 Support Requests</h2>
          <button className="text-white" onClick={() => setShowUserList(false)}>
            <FiX size={24} />
          </button>
        </div>

        {/* ✅ Loading & User List */}
        {isFetching ? (
          <p className="text-gray-400 animate-pulse text-center">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet.</p>
        ) : (
          <ul className="space-y-2 overflow-y-auto flex-1">
            {users.map((user) => (
              <li
                key={user._id}
                className={`p-3 rounded-lg cursor-pointer text-white ${
                  selectedUser?._id === user._id ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => onSelectUser(user)}
              >
                <p className="font-semibold">{user.userName}</p>
                <p className="text-sm text-gray-300">{user.conversation?.length || 0} messages</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Dark Overlay for Mobile View */}
      {showUserList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowUserList(false)}></div>
      )}
    </div>
  );
}
