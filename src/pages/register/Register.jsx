import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!emailRegex.test(e.target.value) ? "Invalid email format" : "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(confirmPassword && e.target.value !== confirmPassword ? "Passwords do not match" : "");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(password !== e.target.value ? "Passwords do not match" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) return;
    await registerUser({ name, email, password });
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 dark:bg-gray-800 shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Create an Account 🎉
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <button type="submit" className="w-full text-white font-semibold py-3 rounded-md transition duration-300 bg-green-600 hover:bg-green-700">
            Register
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
