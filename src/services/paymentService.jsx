import axios from "axios";
import { PAYMENT_CREATE, PAYMENT_VERIFY } from "../config/apiConfig";

// ✅ Get JWT from localStorage (Ensure it exists)
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt");
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// ✅ Create PayPal Payment (Now includes JWT)
export const createPayment = async (plan) => {
  const response = await axios.post(
    PAYMENT_CREATE,
    { plan },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      withCredentials: true, // Ensure cookies are sent for authentication
    }
  );
  return response.data;
};

// ✅ Verify PayPal Payment (Now includes JWT)
export const verifyPayment = async (paymentId, payerId) => {
  const response = await axios.get(
    `${PAYMENT_VERIFY}?paymentId=${paymentId}&payerId=${payerId}`,
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
