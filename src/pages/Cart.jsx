import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, updateQuantity, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
                <div className="card p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Your Cart is Empty</h2>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-button-primary text-button-text rounded hover:bg-button-hover transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-primary text-primary">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-primary">Your Cart</h1>
                <div className="card p-6 rounded-lg shadow-md">
                    <ul className="mb-4">
                        {cart.map((item) => (
                            <li key={item._id} className="flex justify-between items-center py-2">
                                <span className="text-primary">{item.title} (₹{item.price})</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="px-3 py-1 bg-secondary text-primary rounded hover:bg-tertiary"
                                    >
                                        -
                                    </button>
                                    <span className="text-primary">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 bg-secondary text-primary rounded hover:bg-tertiary"
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span className="text-primary">Total:</span>
                        <span className="text-primary">₹{totalPrice}</span>
                    </div>
                    <Link
                        to="/checkout"
                        className="w-full block text-center px-4 py-2 bg-button-primary text-button-text rounded hover:bg-button-hover transition-colors duration-200"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;