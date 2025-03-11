import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ✅ Validation Regex
  const usernameRegex = /^[a-zA-Z0-9@#$]+$/; // ✅ Letters, numbers, @, #, $
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/; // ✅ At least 8 chars, 1 uppercase, 1 number, 1 special char

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(
      e.target.value.includes(" ")
        ? "Username cannot contain spaces!"
        : !usernameRegex.test(e.target.value)
        ? "Username can only have letters, numbers, and @ # $"
        : ""
    );
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!emailRegex.test(e.target.value) ? "Invalid email format" : "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(
      e.target.value.includes(" ")
        ? "Password cannot contain spaces!"
        : !passwordRegex.test(e.target.value)
        ? "Password must be at least 8 chars, 1 uppercase, 1 number, 1 special char (@#$%^&+=!)"
        : confirmPassword && e.target.value !== confirmPassword
        ? "Passwords do not match"
        : ""
    );
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(password !== e.target.value ? "Passwords do not match" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError || emailError || passwordError) return;
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
          {/* Username Field */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Username (No spaces, only letters, numbers, @#$)
            </label>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={handleNameChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                nameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
              required
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Email (🔔 We recommend using a temporary email for safety)
            </label>
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

          {/* Password Field */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Password (Min 8 chars, 1 uppercase, 1 number, 1 special char)
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-green-500"
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
              required
            />
          </div>

          {/* Confirm Password Field */}
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

          {/* Register Button */}
          <button
            type="submit"
            disabled={!!nameError || !!emailError || !!passwordError}
            className={`w-full text-white font-semibold py-3 rounded-md transition duration-300 ${
              nameError || emailError || passwordError ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
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
