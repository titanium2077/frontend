import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { ADMIN_SUPPORT_API } from "../../config/apiConfig";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";
import ReplyInput from "../components/ReplyInput";

export default function ManageSupport() {
  const { token, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    try {
      setIsFetching(true);
      const jwt = token || localStorage.getItem("jwt");

      if (!jwt) {
        console.error("🚨 No token found. Redirecting to login...");
        logout();
        navigate("/login");
        return;
      }

      const { data } = await axios.get(`${ADMIN_SUPPORT_API}/admin`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt.trim()}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0]);
        setMessages(data[0].conversation || []);
      }
    } catch (error) {
      console.error("🚨 Error fetching users:", error.response?.data?.message || error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages(user.conversation || []);
    scrollToBottom();
    setShowUserList(false);
  };

  const handleReply = async () => {
    if (!selectedUser || !reply.trim()) return;

    setLoading(true);
    try {
      const jwt = token || localStorage.getItem("jwt");

      await axios.put(
        `${ADMIN_SUPPORT_API}/${selectedUser._id}/reply`,
        { reply: reply.trim() },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt.trim()}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      setReply("");
      fetchUsers();
    } catch (error) {
      console.error("🚨 Error sending reply:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col md:flex-row">
      {/* ✅ User List Sidebar */}
      <UserList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
        isFetching={isFetching}
        showUserList={showUserList}
        setShowUserList={setShowUserList}
      />

      {/* ✅ Chat Panel */}
      <div className="flex flex-col flex-1 bg-gray-800 rounded-lg shadow-lg h-screen md:h-[85vh]">
        <ChatBox messages={messages} selectedUser={selectedUser} messagesEndRef={messagesEndRef} />
        {selectedUser && (
          <ReplyInput reply={reply} setReply={setReply} handleReply={handleReply} loading={loading} />
        )}
      </div>
    </div>
  );
}
