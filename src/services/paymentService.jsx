import axios from "axios";
import { PAYMENT_CREATE, PAYMENT_VERIFY } from "../config/apiConfig";

// ✅ Create PayPal Payment
export const createPayment = async (plan) => {
  const response = await axios.post(
    `${PAYMENT_CREATE}`,
    { plan },
    { withCredentials: true }
  );
  return response.data; // Contains PayPal Approval URL
};

// ✅ Verify PayPal Payment
export const verifyPayment = async (paymentId, payerId) => {
  const response = await axios.get(
    `${PAYMENT_VERIFY}?paymentId=${paymentId}&payerId=${payerId}`,
    { withCredentials: true }
  );
  return response.data; // Confirmation Message
};
