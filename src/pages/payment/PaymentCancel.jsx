import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.warning("Payment was canceled ❌");
    navigate("/payment");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-red-400">❌ Payment Canceled</h1>
    </div>
  );
}
