import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Checkout() {
    const { currentUser, loading } = useAuth();
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
        phone: "",
        room: "",
        block: "",
        floor: "",
    });
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (!loading && !currentUser) {
            alert("Please log in to continue with checkout.");
            navigate("/");
        }
    }, [loading, currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!deliveryInfo.phone || !/^\d{10}$/.test(deliveryInfo.phone)) {
            return "Please enter a valid 10-digit phone number.";
        }
        if (!deliveryInfo.room) {
            return "Please enter your room number.";
        }
        if (!deliveryInfo.block) {
            return "Please enter your block.";
        }
        if (!deliveryInfo.floor) {
            return "Please enter your floor number.";
        }
        return null;
    };

    const handleCheckout = async () => {
        if (!currentUser) {
            alert("Please log in to complete your order.");
            navigate("/");
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        setIsProcessing(true);
        setFormError(null);

        try {
            const orderId = `ORD${Date.now()}`;
            const timestamp = Date.now();
            const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

            const order = {
                orderId,
                timestamp,
                total: totalPrice,
                items: cart.map((item) => ({
                    ...item,
                    quantity: item.quantity || 1,
                })),
                phone: deliveryInfo.phone,
                room: deliveryInfo.room,
                block: deliveryInfo.block,
                floor: deliveryInfo.floor,
            };

            const storedOrders = localStorage.getItem(`orders_${currentUser.uid}`);
            const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];
            const updatedOrders = [...existingOrders, order];

            localStorage.setItem(`orders_${currentUser.uid}`, JSON.stringify(updatedOrders));

            alert("Checkout successful! Thank you for your order.");
            clearCart();
            navigate("/order-confirmation");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Failed to process your order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="frosted-glass p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Please Log In</h2>
                    <p className="mb-4">You need to be logged in to checkout.</p>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="frosted-glass p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Your Cart is Empty</h2>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>
                <div className="frosted-glass p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                    {formError && <p className="text-red-400 mb-4">{formError}</p>}
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={deliveryInfo.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your 10-digit phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="room" className="block text-gray-300 mb-1">
                                Room Number
                            </label>
                            <input
                                type="text"
                                id="room"
                                name="room"
                                value={deliveryInfo.room}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your room number"
                            />
                        </div>
                        <div>
                            <label htmlFor="block" className="block text-gray-300 mb-1">
                                Block
                            </label>
                            <input
                                type="text"
                                id="block"
                                name="block"
                                value={deliveryInfo.block}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your block (e.g., A)"
                            />
                        </div>
                        <div>
                            <label htmlFor="floor" className="block text-gray-300 mb-1">
                                Floor
                            </label>
                            <input
                                type="text"
                                id="floor"
                                name="floor"
                                value={deliveryInfo.floor}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your floor number (e.g., 1)"
                            />
                        </div>
                    </form>

                    <h2 className="text-xl font-semibold mt-6 mb-4">Order Summary</h2>
                    <ul className="mb-4">
                        {cart.map((item) => (
                            <li key={item._id} className="flex justify-between py-2">
                                <span>{item.title} (x{item.quantity})</span>
                                <span>₹{item.price * item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className={`mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded transition-colors duration-200 ${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                    >
                        {isProcessing ? "Processing..." : "Confirm Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;