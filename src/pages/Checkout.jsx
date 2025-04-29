import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useShopStatus } from "../context/ShopStatusContext";
import axios from "axios";

function Checkout() {
    const { currentUser, loading: authLoading } = useAuth();
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
    const { shopStatus, loading: statusLoading } = useShopStatus();

    useEffect(() => {
        if (!authLoading && !statusLoading && (!currentUser || shopStatus === "closed")) {
            if (!currentUser) {
                alert("Please log in to continue with checkout.");
                navigate("/");
            } else if (shopStatus === "closed") {
                alert("Sorry, the shop is currently closed. Please try again later.");
                navigate("/");
            }
        }
    }, [authLoading, statusLoading, currentUser, shopStatus, navigate]);

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
        const blockUpper = deliveryInfo.block.toUpperCase();
        if (!["A", "B", "C"].includes(blockUpper)) {
            return "Block must be A, B, or C.";
        }
        const floorNum = parseInt(deliveryInfo.floor, 10);
        if (!deliveryInfo.floor || isNaN(floorNum) || floorNum < 0 || floorNum > 4) {
            return "Floor must be a number between 0 (Ground Floor) and 4.";
        }
        return null;
    };

    const handleCheckout = async () => {
        if (!currentUser || shopStatus === "closed") {
            alert("Cannot process order: Shop is closed or you need to log in.");
            navigate("/");
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        if (totalPrice < 30) {
            setFormError("Minimum order value is ₹30. Please add more items to your cart.");
            return;
        }

        setIsProcessing(true);
        setFormError(null);

        try {
            const orderId = `ORD${Date.now()}`;
            const timestamp = Date.now();
            const token = await currentUser.getIdToken();

            const order = {
                orderId,
                userId: currentUser.uid,
                timestamp,
                total: totalPrice,
                items: cart.map((item) => ({
                    _id: item._id,
                    title: item.title, // Changed from name to title
                    price: item.price,
                    quantity: item.quantity || 1,
                })),
                phone: deliveryInfo.phone,
                room: deliveryInfo.room,
                block: deliveryInfo.block.toUpperCase(),
                floor: parseInt(deliveryInfo.floor, 10),
            };

            console.log("Cart Contents:", cart); // Debug
            console.log("Order Data:", order); // Debug

            await axios.post("http://localhost:5005/api/orders", order, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Checkout successful! Thank you for your order.");
            clearCart();
            navigate("/order-confirmation");
        } catch (error) {
            console.error("Error during checkout:", error);
            alert(error.response?.data?.error || "Failed to process your order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading || statusLoading) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!currentUser || shopStatus === "closed") {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="frosted-glass p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        {shopStatus === "closed" ? "Shop Closed" : "Please Log In"}
                    </h2>
                    <p className="mb-4 text-gray-400">
                        {shopStatus === "closed"
                            ? "Sorry, the shop is currently closed. Please try again later."
                            : "You need to be logged in to checkout."}
                    </p>
                    <Link
                        to={shopStatus === "closed" ? "/" : "/"}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        {shopStatus === "closed" ? "Go to Home" : "Go to Login"}
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
                                placeholder="Enter your room number (e.g., 101)"
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
                                placeholder="Enter your block (A, B, or C)"
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
                                placeholder="Enter your floor (0 for Ground, 1-4)"
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
                        disabled={isProcessing || shopStatus === "closed"}
                        className={`mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded transition-colors duration-200 ${
                            isProcessing || shopStatus === "closed" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                    >
                        {shopStatus === "closed"
                            ? "Shop Closed"
                            : isProcessing
                            ? "Processing..."
                            : "Confirm Order"}
                    </button>
                    {shopStatus === "closed" && (
                        <p className="text-red-400 text-sm mt-2 text-center">
                            The shop is currently closed. Please try again later.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;