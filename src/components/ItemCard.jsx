import { useState } from "react"; // Add this import

function ItemCard({ item, addToCart }) {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(quantity + 1);
    const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white">
            <img
                src={item.image || "placeholder.jpg"}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600 mb-2">₹{item.price}</p>
            {item.stock > 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center">
                        <button
                            onClick={handleDecrement}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            -
                        </button>
                        <span className="mx-2">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => addToCart(item, quantity)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add to Bag
                    </button>
                </div>
            ) : (
                <p className="text-red-500">Out of Stock</p>
            )}
        </div>
    );
}

export default ItemCard;