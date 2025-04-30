import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from '../config/api';

function OrderConfirmation() {
  const { currentUser, loading } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || !currentUser) return;

    const fetchOrder = async () => {
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get(getApiUrl(`api/orders/${orderId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (e) {
        console.error("Error fetching order:", e);
        setError("Failed to load order confirmation.");
      }
    };

    fetchOrder();
  }, [currentUser, loading, orderId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center bg-primary text-primary min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center bg-primary text-primary min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-error-text mb-4">{error}</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-button-primary text-button-text rounded hover:bg-button-hover transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center bg-primary text-primary min-h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
        <p className="text-secondary">No order found.</p>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-button-primary text-button-text rounded hover:bg-button-hover transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-primary text-primary min-h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
      <div className="card p-6 rounded-xl border border-border-color">
        <h2 className="text-2xl font-semibold mb-2">Thank You for Your Order!</h2>
        <p className="text-secondary">Order #{order.orderId}</p>
        <p className="text-secondary">Placed on: {new Date(order.timestamp).toLocaleString()}</p>
        <p className="text-secondary">
          Delivery to: {order.room}, Block {order.block}, Floor {order.floor}
        </p>
        <p className="text-secondary">Phone: {order.phone}</p>
        <h3 className="text-lg font-semibold mt-4">Items:</h3>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item._id} className="text-secondary">
              {item.title} - ₹{item.price} x {item.quantity}
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold mt-2">Total: ₹{order.total}</p>
        <p className="text-secondary mt-2">No refunds or returns as per policy.</p>
        <Link
          to="/order-history"
          className="mt-4 inline-block px-6 py-2 bg-button-primary text-button-text rounded hover:bg-button-hover transition-all duration-300"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;