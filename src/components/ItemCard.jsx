import { useState } from "react";

function ItemCard({ item, addToCart }) {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleAdd = () => {
        addToCart(item, quantity);
    };

    return (
        <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-white p-4 flex justify-center items-center">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-contain"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                    <p className="text-gray-700 mb-2">₹{item.price}</p>
                </div>
                <div className="flex items-center mt-2 gap-2">
                    <button
                        onClick={decreaseQuantity}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                    >
                        -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button
                        onClick={increaseQuantity}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                    >
                        +
                    </button>
                    <button
                        onClick={handleAdd}
                        className="ml-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;
