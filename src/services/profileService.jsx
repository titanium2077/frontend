import axios from "axios";
import { AUTH_URL__USER_PROFILE } from "../config/apiConfig";

// ✅ Get User Profile
export const getUserProfile = async () => {
  return await axios.get(AUTH_URL__USER_PROFILE, { withCredentials: true });
};
