import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, updateQuantity, clearCart } = useCart();

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
                <h1 className="text-3xl font-bold mb-6 text-white">Your Cart</h1>
                <div className="frosted-glass p-6 rounded-lg shadow-md">
                    <ul className="mb-4">
                        {cart.map((item) => (
                            <li key={item._id} className="flex justify-between items-center py-2">
                                <span>{item.title} (₹{item.price})</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total:</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <Link
                        to="/checkout"
                        className="w-full block text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;