export default function ChatBox({ messages, selectedUser, messagesEndRef }) {
    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-700 rounded-lg space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="space-y-2">
              {msg.sender === "user" ? (
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs shadow-lg">
                    <p className="text-sm font-semibold">{selectedUser?.userName}</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg max-w-xs shadow-lg">
                    <p className="text-sm font-semibold">Admin</p>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Select a user to view messages.</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>
    );
  }
  