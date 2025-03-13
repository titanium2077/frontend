import axios from "axios";
import { PAYMENT_CREATE, PAYMENT_VERIFY } from "../config/apiConfig";

// ✅ Get JWT Token for Authorization
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ **Create Crypto Payment (BTC, USDT)**
export const createPayment = async (plan) => {
  const response = await axios.post(
    PAYMENT_CREATE,
    { plan },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      withCredentials: true, // ✅ Ensure JWT authentication
    }
  );
  return response.data; // ✅ Returns the BTCPay checkout link
};

// ✅ **Verify Crypto Payment**
export const verifyPayment = async (paymentId) => {
  const response = await axios.get(
    `${PAYMENT_VERIFY}?paymentId=${paymentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      withCredentials: true,
    }
  );
  return response.data;
};