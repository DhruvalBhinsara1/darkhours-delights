import { useState } from "react";

function ItemCard({ item, addToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [imgSrc, setImgSrc] = useState(item.image);
    const [imgLoading, setImgLoading] = useState(true);

    const handleAdd = () => {
        if (quantity > 0 && quantity <= item.stock) {
            addToCart(item, quantity);
        }
    };

    const isDisabled = item.stock === 0;

    const handleImageError = (e) => {
        console.error(`Failed to load image for ${item.title}:`, e);
        setImgSrc("https://via.placeholder.com/150?text=Image+Not+Found");
        setImgLoading(false);
    };

    const handleImageLoad = () => {
        setImgLoading(false);
    };

    return (
        <div
            className={`frosted-glass p-3 rounded-lg shadow-lg transition-transform duration-300 transform ${isDisabled
                    ? "opacity-50"
                    : "hover:scale-105 hover:shadow-xl hover:bg-opacity-80"
                } bg-gray-800 bg-opacity-70 backdrop-blur-md border border-gray-700`}
        >
            <div className="relative w-full h-36 flex items-center justify-center">
                {imgLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="animate-spin h-6 w-6 text-blue-500"
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
                    </div>
                )}
                <img
                    src={imgSrc}
                    alt={item.title}
                    className={`w-full h-full object-contain rounded mb-3 transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"
                        }`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    loading="lazy"
                />
            </div>
            <h3 className="text-base font-semibold text-white truncate">{item.title}</h3>
            <p className="text-gray-300 text-xs">₹{item.price}</p>
            <p
                className={`text-xs ${isDisabled ? "text-red-400" : "text-gray-300"
                    }`}
            >
                Stock: {item.stock}
            </p>
            <div className="flex items-center gap-2 mt-2 justify-between">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                        className={`px-2 py-1 rounded-lg text-white text-sm transition-colors duration-200 ${isDisabled || quantity <= 1
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        disabled={isDisabled || quantity <= 1}
                    >
                        -
                    </button>
                    <span className="text-white font-medium text-sm">{quantity}</span>
                    <button
                        onClick={() =>
                            setQuantity(quantity < item.stock ? quantity + 1 : quantity)
                        }
                        className={`px-2 py-1 rounded-lg text-white text-sm transition-colors duration-200 ${isDisabled || quantity >= item.stock
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        disabled={isDisabled || quantity >= item.stock}
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleAdd}
                    className={`px-3 py-1 rounded-lg text-white font-medium text-sm transition-all duration-300 transform ${isDisabled
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                        }`}
                    disabled={isDisabled}
                >
                    {isDisabled ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}

export default ItemCard;