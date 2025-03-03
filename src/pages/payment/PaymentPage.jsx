import { useState } from "react";
import { createPayment } from "../../services/paymentService";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async (plan) => {
    setLoading(true);
    try {
      const { link } = await createPayment(plan);
      window.location.href = link; // ✅ Redirect to PayPal
    } catch (error) {
      console.error("🚨 Payment Error:", error);
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400">💾 Buy More Storage</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {["small", "medium", "large"].map((plan, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white">{plan.toUpperCase()} Plan</h2>
            <p className="text-gray-400 mt-2">{plan === "small" ? "50GB" : plan === "medium" ? "200GB" : "500GB"} Storage</p>
            <p className="text-green-400 font-bold mt-2">
              ${plan === "small" ? "9.99" : plan === "medium" ? "14.99" : "19.99"}
            </p>

            <button
              onClick={() => handlePayment(plan)}
              disabled={loading}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
