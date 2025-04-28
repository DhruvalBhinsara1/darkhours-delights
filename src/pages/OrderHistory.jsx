import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function OrderHistory() {
  const { currentUser, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  console.log("OrderHistory - Current User:", currentUser);
  console.log("OrderHistory - Loading:", loading);

  useEffect(() => {
    if (loading || !currentUser) return;

    try {
      const storedOrders = localStorage.getItem(`orders_${currentUser.uid}`);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
        } else {
          setOrders([]);
          setError("Invalid order data in storage.");
        }
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error("Error parsing orders from localStorage:", e);
      setError("Failed to load order history.");
      setOrders([]);
    }
  }, [currentUser, loading]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <p className="text-red-400 mb-4">{error}</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 frosted-glass"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400">You have no past orders.</p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 frosted-glass"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="frosted-glass p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Order #{order.orderId}</h2>
              <p className="text-gray-400">Placed on: {new Date(order.timestamp).toLocaleString()}</p>
              <p className="text-gray-400">
                Delivery to: {order.room}, Block {order.block}, Floor {order.floor}
              </p>
              <p className="text-gray-400">Phone: {order.phone}</p>
              <h3 className="text-lg font-semibold mt-4">Items:</h3>
              <ul className="list-disc list-inside">
                {order.items.map((item) => (
                  <li key={item._id} className="text-gray-400">
                    {item.title} - ₹{item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold mt-2">Total: ₹{order.total}</p>
              <p className="text-gray-400 mt-2">No refunds or returns as per policy.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;