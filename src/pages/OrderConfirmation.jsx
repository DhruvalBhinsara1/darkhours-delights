import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

function OrderConfirmation() {
    const { currentUser, loading } = useAuth();
    const [latestOrder, setLatestOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loading || !currentUser) return;

        const fetchLatestOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5005/api/orders/${currentUser.uid}`);
                const orders = response.data;
                if (Array.isArray(orders) && orders.length > 0) {
                    setLatestOrder(orders[0]); // Latest order (sorted by timestamp descending)
                } else {
                    setError("No orders found.");
                }
            } catch (e) {
                console.error("Error fetching latest order:", e);
                setError("Failed to load order confirmation.");
            }
        };

        fetchLatestOrder();
    }, [currentUser, loading]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
                <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
                <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
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

    if (!latestOrder) {
        return (
            <div className="container mx-auto p-4 text-center bg-gray-900 text-gray-300 min-h-[calc(100vh-8rem)]">
                <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
                <p className="text-gray-400">No recent order found.</p>
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
            <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
            <div className="frosted-glass p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Thank You for Your Order!</h2>
                <p className="text-gray-400">Order #{latestOrder.orderId}</p>
                <p className="text-gray-400">Placed on: {new Date(latestOrder.timestamp).toLocaleString()}</p>
                <p className="text-gray-400">
                    Delivery to: {latestOrder.room}, Block {latestOrder.block}, Floor {latestOrder.floor}
                </p>
                <p className="text-gray-400">Phone: {latestOrder.phone}</p>
                <h3 className="text-lg font-semibold mt-4">Items:</h3>
                <ul className="list-disc list-inside">
                    {latestOrder.items.map((item) => (
                        <li key={item._id} className="text-gray-400">
                            {item.title} - ₹{item.price} x {item.quantity}
                        </li>
                    ))}
                </ul>
                <p className="text-lg font-bold mt-2">Total: ₹{latestOrder.total}</p>
                <p className="text-gray-400 mt-2">No refunds or returns as per policy.</p>
                <Link
                    to="/order-history"
                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 frosted-glass"
                >
                    View Order History
                </Link>
            </div>
        </div>
    );
}

export default OrderConfirmation;