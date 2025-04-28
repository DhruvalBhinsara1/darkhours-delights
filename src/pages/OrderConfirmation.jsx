import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OrderConfirmation() {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user || !state?.orderId) {
        navigate("/"); // Redirect if user is not logged in or no orderId
        return null;
    }

    // Fetch the order from localStorage
    const storedOrders = localStorage.getItem(`orders_${user.sub}`);
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    const order = orders.find((o) => o.orderId === state.orderId);

    if (!order) {
        navigate("/"); // Redirect if order not found
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p>Order ID: {order.orderId}</p>
            <p>Estimated Delivery: 15 minutes</p>
            <p>Delivery to: {order.room}, Block {order.block}, Floor {order.floor}</p>
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
            <Link to="/order-history" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Order History
            </Link>
        </div>
    );
}

export default OrderConfirmation;