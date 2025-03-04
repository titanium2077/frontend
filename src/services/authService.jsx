import axios from "axios";
import {
  AUTH_URL_ADMIN_LOGIN,
  AUTH_URL_USER_LOGIN,
  AUTH_URL_USER_LOGOUT,
  AUTH_URL_USER_REGISTER,
  AUTH_URL_USER_PROFILE,
} from "../config/apiConfig";

// ✅ Handle API Errors (Better error messages)
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Network error";
    //console.error("API Error:", errorMessage);
    throw new Error(errorMessage);
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  return handleRequest(
    axios.post(`${AUTH_URL_USER_REGISTER}`, userData, { withCredentials: true })
  );
};

// ✅ Login User
export const loginUser = async (userData) => {
  return handleRequest(
    axios.post(`${AUTH_URL_USER_LOGIN}`, userData, { withCredentials: true })
  );
};

// ✅ Login Admin (Corrected to use `API_URL`)
export const loginAdmin = async (adminData) => {
  return handleRequest(
    axios.post(`${AUTH_URL_ADMIN_LOGIN}`, adminData, { withCredentials: true })
  );
};

// ✅ Logout User/Admin
export const logoutUser = async () => {
  return handleRequest(
    axios.post(`${AUTH_URL_USER_LOGOUT}`, {}, { withCredentials: true })
  );
};

// ✅ Get Authenticated User (Handles both User & Admin)
export const getAuthenticatedUser = async () => {
  return handleRequest(
    axios.get(`${AUTH_URL_USER_PROFILE}`, { withCredentials: true })
  );
};
