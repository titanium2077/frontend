import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SUPPORT_CHAT_API } from "../config/apiConfig"; // ✅ API Endpoint
import { FiSend } from "react-icons/fi"; // ✅ Send icon
import { AuthContext } from "../context/AuthContext"; // ✅ Get user authentication info
import { useNavigate } from "react-router-dom";

export default function ChatSupport() {
  const { user, token, logout } = useContext(AuthContext); // ✅ Get authenticated user and token
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  const fetchMessages = async () => {
    try {
      if (!user) return;
  
      const jwt = token || localStorage.getItem("jwt");
      if (!jwt) {
        console.error("🚨 No token found. Redirecting to login...");
        logout();
        navigate("/login");
        return;
      }
  
      const { data } = await axios.get(SUPPORT_CHAT_API, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.trim()}`,
        },
      });
  
      console.log("🔍 API Response:", data); // ✅ Log API response
      setMessages(data.conversation || []); // ✅ Ensure conversation exists
    } catch (error) {
      console.error("🚨 Authentication Error:", error.response?.data?.message || error.message);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
        navigate("/login");
      }
    }
  };

  const toggleChat = () => {
    if (!user) {
      return navigate("/login"); // ✅ Redirect if not logged in
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // ✅ Get token from localStorage if missing
      const jwt = token || localStorage.getItem("jwt");
      if (!jwt) {
        console.error("🚨 No token found. Redirecting to login...");
        logout();
        navigate("/login");
        return;
      }

      await axios.post(
        SUPPORT_CHAT_API,
        { message },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt.trim()}`,
          },
        }
      );

      setMessage("");
      fetchMessages(); // ✅ Refresh chat after sending
    } catch (error) {
      console.error(
        "🚨 Error sending message:",
        error.response?.data?.message || error.message
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 md:p-5 rounded-full shadow-lg transition-all z-50"
      >
        💬
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md md:w-[80%] lg:w-[60%] xl:w-[40%] text-white">
            <h2 className="text-lg md:text-xl font-bold text-center">
              Chat with Support
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Tell us your issue, and we'll help you.
            </p>

            {/* ✅ Chat Messages */}
            <div className="h-60 overflow-y-auto p-3 bg-gray-800 rounded-md space-y-2">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className="space-y-1">
                    {/* ✅ User Message (Right Side) */}
                    {msg.sender === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-gray-300">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // ✅ Admin Reply (Left Side)
                      <div className="flex justify-start">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg max-w-xs">
                          <p className="text-sm font-semibold">Admin</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-gray-300">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No messages yet. Start chatting!
                </p>
              )}
            </div>

            {/* ✅ Send Message Input */}
            <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
              <input
                type="text"
                placeholder={
                  user ? "Type your message..." : "Login to send messages"
                }
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!user} // ✅ Disable input if not logged in
              />
              <button
                type="submit"
                disabled={!user || loading}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  user
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                <FiSend className="mr-2" />
                {loading ? "Sending..." : "Send"}
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={toggleChat}
              className="mt-4 w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
