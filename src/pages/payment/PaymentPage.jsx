import { useState } from "react";
import { createPayment } from "../../services/paymentService";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ✅ Open Modal
  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ✅ Handle Payment
  const handlePayment = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const { link } = await createPayment(selectedPlan, selectedCrypto);
      window.location.href = link; // ✅ Redirect user to BTCPay checkout
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed! ❌");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const packages = [
    { name: "Medium", size: "10GB", price: "15.99", plan: "medium" },
    { name: "Large", size: "20GB", price: "24.99", plan: "large" },
    { name: "XLarge", size: "40GB", price: "49.99", plan: "xlarge" },
    { name: "XXLarge", size: "80GB", price: "99.99", plan: "xxlarge" },
    { name: "Mega", size: "180GB", price: "199.99", plan: "mega" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400">💾 Buy More Storage</h1>

      {/* ✅ Storage Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold text-white">{pkg.name} Plan</h2>
            <p className="text-gray-400 mt-2">{pkg.size} Storage</p>
            <p className="text-green-400 font-bold mt-2">${pkg.price}</p>

            <button
              onClick={() => openModal(pkg.plan)}
              disabled={loading}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-white">
              Select Payment Method
            </h2>

            <div className="mt-4">
              <button
                className={`w-full p-2 my-2 rounded-md border ${
                  selectedCrypto === "BTC"
                    ? "bg-blue-600 border-blue-400"
                    : "bg-gray-700 border-gray-500"
                }`}
                onClick={() => setSelectedCrypto("BTC")}
              >
                Bitcoin (BTC)
              </button>
              <button
                className={`w-full p-2 my-2 rounded-md border ${
                  selectedCrypto === "LTC"
                    ? "bg-blue-600 border-blue-400"
                    : "bg-gray-700 border-gray-500"
                }`}
                onClick={() => setSelectedCrypto("LTC")}
              >
                Litecoin (LTC)
              </button>
              <button
                className={`w-full p-2 my-2 rounded-md border ${
                  selectedCrypto === "DOGE"
                    ? "bg-blue-600 border-blue-400"
                    : "bg-gray-700 border-gray-500"
                }`}
                onClick={() => setSelectedCrypto("DOGE")}
              >
                Dogecoin (DOGE)
              </button>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={handlePayment}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}