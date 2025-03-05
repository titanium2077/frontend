const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_API_URL;
export const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY;

// ✅ Debugging - Check if VITE_API_URL is loading correctly
// console.log("🔹 Debugging VITE_API_URL:", API_URL);

if (!API_URL) {
  throw new Error("❌ API_URL is not defined! Check your .env file.");
}

// ✅ Auth Endpoints
const AUTH_URL = `${API_URL}/auth`;
const AUTH_URL_USER_REGISTER = `${AUTH_URL}/register`;
const AUTH_URL_USER_LOGIN = `${AUTH_URL}/login`;
const AUTH_URL_ADMIN_LOGIN = `${AUTH_URL}/admin/login`;
const AUTH_URL_USER_LOGOUT = `${AUTH_URL}/logout`;
const AUTH_URL_USER_PROFILE = `${AUTH_URL}/me`; // ✅ Fixed: Removed double underscore

// ✅ Feed Endpoints
const FEED_URL = `${API_URL}/feed`;
const FEED_URL_CREATE = `${FEED_URL}/create`;
const FEED_URL_UPDATE = `${FEED_URL}/update`;
const FEED_URL_DELETE = `${FEED_URL}/delete`;
const FEED_URL_DOWNLOAD = `${FEED_URL}/download`;

// ✅ Admin Endpoints
const ADMIN_URL = `${API_URL}/admin`;
const ADMIN_DASHBOARD = `${ADMIN_URL}/dashboard`;
const ADMIN_UPLOAD = `${ADMIN_URL}/upload`;

// ✅ Payment Endpoints
const PAYMENT_URL = `${API_URL}/payments`;
const PAYMENT_CREATE = `${PAYMENT_URL}/paypal-payment`;
const PAYMENT_VERIFY = `${PAYMENT_URL}/paypal-verify`;

// ✅ Ensure exports are unique and match imports
export {
  API_URL,
  IMAGE_URL,
  AUTH_URL,
  AUTH_URL_USER_REGISTER,
  AUTH_URL_USER_LOGIN,
  AUTH_URL_ADMIN_LOGIN,
  AUTH_URL_USER_LOGOUT,
  AUTH_URL_USER_PROFILE, // ✅ Fixed Export
  FEED_URL, // ✅ Fixed Export
  FEED_URL_CREATE,
  FEED_URL_UPDATE,
  FEED_URL_DELETE,
  FEED_URL_DOWNLOAD,
  ADMIN_DASHBOARD,
  ADMIN_UPLOAD,
  PAYMENT_URL,
  PAYMENT_CREATE,
  PAYMENT_VERIFY,
};