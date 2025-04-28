import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
    const [form, setForm] = useState({
        phone: "",
        room: "",
        block: "",
        floor: "", // Changed to string to match select value
    });
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to place an order.");
            return;
        }

        try {
            // Simulate Razorpay payment (since backend isn't ready)
            const orderId = "order-" + Date.now();
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Create order object
            const order = {
                orderId,
                timestamp: Date.now(),
                items: cart,
                total,
                phone: form.phone,
                room: form.room,
                block: form.block,
                floor: parseInt(form.floor), // Convert to integer for consistency
            };

            // Save order to localStorage
            const storedOrders = localStorage.getItem(`orders_${user.sub}`);
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            orders.push(order);
            localStorage.setItem(`orders_${user.sub}`, JSON.stringify(orders));

            // Clear cart and navigate to confirmation
            clearCart();
            navigate("/order-confirmation", { state: { orderId } });
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                <p className="text-gray-600">Please log in to place an order.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label className="block mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Room Number</label>
                        <input
                            type="text"
                            name="room"
                            value={form.room}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Block</label>
                        <select
                            name="block"
                            value={form.block}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Block</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Floor Number</label>
                        <select
                            name="floor"
                            value={form.floor}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Floor</option>
                            <option value="0">Ground Floor (0)</option>
                            <option value="1">1st Floor</option>
                            <option value="2">2nd Floor</option>
                            <option value="3">3rd Floor</option>
                            <option value="4">4th Floor</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Place Order
                    </button>
                </form>
            )}
        </div>
    );
}

export default Checkout;