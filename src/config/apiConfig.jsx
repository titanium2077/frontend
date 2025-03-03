const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_API_URL;
export const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY;

// Auth Endpoints
const AUTH_URL = `${API_URL}/auth`;
const AUTH_URL_USER_REGISTER = `${AUTH_URL}/register`;
const AUTH_URL_USER_LOGIN = `${AUTH_URL}/login`;
const AUTH_URL_ADMIN_LOGIN = `${AUTH_URL}/admin/login`;
const AUTH_URL_USER_LOGOUT = `${AUTH_URL}/logout`;
const AUTH_URL__USER_PROFILE = `${AUTH_URL}/me`;

// Feed Endpoints
const FEED_URL = `${API_URL}/feed`;
const FEED_URL_CREATE = `${API_URL}/feed/create`;
const FEED_URL_UPDATE = `${API_URL}/feed/update`;
const FEED_URL_DELETE = `${API_URL}/feed/delete`;
const FEED_URL_DOWNLOAD = `${API_URL}/feed/download`;

// ADMIN Endpoints
const ADMIN_URL = `${API_URL}/admin`;
const ADMIN_DASHBOARD = `${ADMIN_URL}/dashboard`;
const ADMIN_UPLOAD = `${ADMIN_URL}/upload`;

// PAYMENT
const PAYMENT_URL = `${API_URL}/payments`;
const PAYMENT_CREATE = `${PAYMENT_URL}/paypal-payment`;
const PAYMENT_VERIFY = `${PAYMENT_URL}/paypal-verify`;

export {
  API_URL,
  IMAGE_URL,
  PAYMENT_URL,
  FEED_URL,
  FEED_URL_CREATE,
  FEED_URL_UPDATE,
  FEED_URL_DELETE,
  FEED_URL_DOWNLOAD,
  AUTH_URL,
  AUTH_URL_USER_REGISTER,
  AUTH_URL_USER_LOGIN,
  AUTH_URL_ADMIN_LOGIN,
  AUTH_URL_USER_LOGOUT,
  AUTH_URL__USER_PROFILE,
  ADMIN_DASHBOARD,
  ADMIN_UPLOAD,
  PAYMENT_CREATE,
  PAYMENT_VERIFY,
};
