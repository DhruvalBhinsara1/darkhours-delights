import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const { cart, updateQuantity, clearCart } = useCart();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="container mx-auto p-4 min-h-[calc(100vh-8rem)]">
            <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
            {cart.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex flex-col sm:flex-row justify-between items-center border-b py-4 gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image || "placeholder.jpg"}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xl font-bold">Total: ₹{total}</p>
                        {total < 30 ? (
                            <p className="text-red-500 text-center">
                                Minimum order value is ₹30.
                            </p>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={clearCart}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Clear Cart
                                </button>
                                <Link
                                    to="/checkout"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;