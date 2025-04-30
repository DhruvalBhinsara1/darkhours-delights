import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get("https://web-production-6e9b1.up.railway.app/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (e) {
        console.error("Error fetching orders:", e);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order History</h1>
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-accent-primary mr-3"
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
            <p className="text-secondary">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order History</h1>
          <p className="text-error-text mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary">
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-8 text-primary">Order History</h1>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-secondary mb-6">You have no past orders.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="card p-5 rounded-xl border border-border-color shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-primary">
                    Order #{order.orderId}
                  </h2>
                  <span className="text-xs text-secondary bg-secondary px-2 py-1 rounded-full">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-secondary text-sm mb-1">
                  <span className="font-medium text-primary">Placed on:</span>{" "}
                  {new Date(order.timestamp).toLocaleString()}
                </p>
                <p className="text-secondary text-sm mb-1">
                  <span className="font-medium text-primary">Delivery to:</span>{" "}
                  {order.room}, Block {order.block}, Floor {order.floor}
                </p>
                <p className="text-secondary text-sm mb-4">
                  <span className="font-medium text-primary">Phone:</span>{" "}
                  {order.phone}
                </p>
                <h3 className="text-lg font-semibold text-primary mb-2">Items:</h3>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={item._id}
                      className="text-secondary text-sm flex justify-between"
                    >
                      <span>
                        {item.title} (x{item.quantity})
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center border-t border-border-color pt-3">
                  <p className="text-lg font-bold text-primary">
                    Total: ₹{order.total}
                  </p>
                  <p className="text-secondary text-xs italic">
                    No refunds or returns
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;