import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const { currentUser, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  console.log("OrderHistory - Current User:", currentUser);
  console.log("OrderHistory - Loading:", loading);

  useEffect(() => {
    if (loading || !currentUser) return;

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:5005/api/orders/${currentUser.uid}`);
            setOrders(response.data);
        } catch (e) {
            console.error("Error fetching orders:", e);
            setError("Failed to load order history.");
            setOrders([]);
        }
    };

    fetchOrders();
}, [currentUser, loading]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">
          Order History
        </h1>
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="text-gray-400 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">
          Order History
        </h1>
        <p className="text-red-400 mb-6 text-lg">{error}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 frosted-glass transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-white tracking-tight">
        Order History
      </h1>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg mb-6">You have no past orders.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 frosted-glass transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="frosted-glass p-5 rounded-xl border border-gray-700 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-opacity-70"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-white">
                  Order #{order.orderId}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
                  {new Date(order.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-medium text-gray-300">Placed on:</span>{" "}
                {new Date(order.timestamp).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-medium text-gray-300">Delivery to:</span>{" "}
                {order.room}, Block {order.block}, Floor {order.floor}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                <span className="font-medium text-gray-300">Phone:</span>{" "}
                {order.phone}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">Items:</h3>
              <ul className="list-disc list-inside mb-4 space-y-1">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="text-gray-400 text-sm flex justify-between"
                  >
                    <span>
                      {item.title} (x{item.quantity})
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <p className="text-lg font-bold text-white">
                  Total: ₹{order.total}
                </p>
                <p className="text-gray-500 text-xs italic">
                  No refunds or returns
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;