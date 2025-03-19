import axios from "axios";
import { PAYMENT_CREATE, PAYMENT_VERIFY } from "../config/apiConfig";

// ✅ Get JWT Token for Authorization
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ **Create Crypto Payment (BTC, LTC, DOGE)**
export const createPayment = async (plan, currency) => {
  const response = await axios.post(
    PAYMENT_CREATE,
    { plan, currency }, 
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