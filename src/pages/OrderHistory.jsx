import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage for the logged-in user
    if (user) {
      const storedOrders = localStorage.getItem(`orders_${user.sub}`);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <p className="text-gray-600">Please log in to view your order history.</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">You have no past orders.</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">Order #{order.orderId}</h2>
              <p className="text-gray-600">Placed on: {new Date(order.timestamp).toLocaleString()}</p>
              <p className="text-gray-600">
                Delivery to: {order.room}, Block {order.block}, Floor {order.floor}
              </p>
              <h3 className="text-lg font-semibold mt-4">Items:</h3>
              <ul className="list-disc list-inside">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.title} - ₹{item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold mt-2">Total: ₹{order.total}</p>
              <p className="text-gray-600 mt-2">No refunds or returns as per policy.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;