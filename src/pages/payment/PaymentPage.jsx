import { useState } from "react";
import { createPayment } from "../../services/paymentService";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (plan) => {
    setLoading(true);
    try {
      const { link } = await createPayment(plan);
      window.location.href = link;
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  const packages = [
    { name: "Mini-Small", size: "1GB", price: "0.99", plan: "mini-small" },
    { name: "Small", size: "5GB", price: "5.99", plan: "small" },
    { name: "Medium", size: "10GB", price: "9.99", plan: "medium" },
    { name: "Large", size: "15GB", price: "14.99", plan: "large" },
    { name: "XLarge", size: "25GB", price: "24.99", plan: "xlarge" },
    { name: "XXLarge", size: "50GB", price: "49.99", plan: "xxlarge" },
    { name: "Mega", size: "100GB", price: "99.99", plan: "mega" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400">💾 Buy More Storage</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white">{pkg.name} Plan</h2>
            <p className="text-gray-400 mt-2">{pkg.size} Storage</p>
            <p className="text-green-400 font-bold mt-2">${pkg.price}</p>

            <button
              onClick={() => handlePayment(pkg.plan)}
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
