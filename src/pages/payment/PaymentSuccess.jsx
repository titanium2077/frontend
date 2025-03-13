import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../../services/paymentService";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");

    if (paymentId) {
      handleVerification(paymentId);
    } else {
      toast.error("Invalid Payment Data ❌");
      navigate("/payment");
    }
  }, [searchParams, navigate]);

  const handleVerification = async (paymentId) => {
    try {
      await verifyPayment(paymentId);
      toast.success("✅ Payment successful! Storage increased 🎉");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Payment verification failed!");
      navigate("/payment");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-green-400">🎉 Payment Successful! Redirecting...</h1>
    </div>
  );
}
