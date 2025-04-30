import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useShopStatus } from "../context/ShopStatusContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl, API_BASE_URL } from '../config/api';

function Checkout() {
    const { cart, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { isOpen } = useShopStatus();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        room: "",
        block: "",
        floor: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setError("The shop is currently closed. Please try again later.");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOpen) {
            setError("The shop is currently closed. Please try again later.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!currentUser) {
                throw new Error("You must be logged in to place an order");
            }

            const token = await currentUser.getIdToken();
            console.log("Got token:", token.slice(0, 20) + "..."); // Debug log

            const orderData = {
                orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                timestamp: new Date().toISOString(),
                total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
                items: cart.map(item => ({
                    _id: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                })),
                phone: formData.phone,
                room: formData.room,
                block: formData.block,
                floor: parseInt(formData.floor)
            };

            console.log('Submitting order:', orderData);

            const response = await axios.post(
                getApiUrl("api/orders"),
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Order response:', response.data);

            if (!response.data) {
                throw new Error('No response data received from server');
            }

            const orderId = response.data.orderId;
            if (!orderId) {
                throw new Error('Invalid order response from server');
            }

            clearCart();
            navigate(`/order-confirmation/${orderId}`);
        } catch (err) {
            console.error("Error placing order:", err);
            console.error("Error details:", err.response?.data);
            console.error("Error status:", err.response?.status);

            let errorMessage = "Failed to place order. Please try again.";
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                    <p className="text-secondary mb-6">
                        Please sign in to complete your order.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                    <p className="text-secondary mb-6">
                        Your cart is empty. Please add some items before checking out.
                    </p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-primary">
            <div className="container mx-auto p-4 sm:p-6">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-error-bg text-error-text">
                        {error}
                    </div>
                )}
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="card p-6 rounded-xl border border-border-color">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-primary font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-secondary text-sm">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-primary font-medium">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                            <div className="border-t border-border-color pt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-primary">Total</p>
                                    <p className="text-lg font-bold text-primary">
                                        ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 rounded-xl border border-border-color">
                        <h2 className="text-2xl font-semibold mb-6">
                            Delivery Information
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="room"
                                    className="block text-sm font-medium text-primary mb-1"
                                >
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    id="room"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleChange}
                                    required
                                    className="input w-full"
                                    placeholder="Enter your room number"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="block"
                                    className="block text-sm font-medium text-primary mb-1"
                                >
                                    Block
                                </label>
                                <input
                                    type="text"
                                    id="block"
                                    name="block"
                                    value={formData.block}
                                    onChange={handleChange}
                                    required
                                    className="input w-full"
                                    placeholder="Enter your block"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="floor"
                                    className="block text-sm font-medium text-primary mb-1"
                                >
                                    Floor
                                </label>
                                <input
                                    type="text"
                                    id="floor"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    required
                                    className="input w-full"
                                    placeholder="Enter your floor"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-primary mb-1"
                                >
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="input w-full"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !isOpen}
                                className="w-full py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2"
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
                                        Processing...
                                    </div>
                                ) : (
                                    "Place Order"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;