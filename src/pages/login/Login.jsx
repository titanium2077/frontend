import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }, navigate);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 dark:bg-gray-800 shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 autofill:bg-transparent"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 autofill:bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
