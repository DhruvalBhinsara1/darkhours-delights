import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { getApiUrl } from '../config/api';

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const { addToCart } = useCart();
    const [addedItemId, setAddedItemId] = useState(null);

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(getApiUrl("api/items"));
                console.log("Fetched items:", response.data);
                setItems(response.data);
            } catch (e) {
                console.error("Error fetching items:", e);
                setError("Failed to load items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const categories = ["all", ...new Set(items.map((item) => item.category))];

    const filteredItems = categoryFilter === "all" ? items : items.filter((item) => item.category === categoryFilter);

    const handleAddToCart = (item) => {
        addToCart({
            _id: item._id,
            title: item.title,
            price: item.price,
            quantity: 1,
        });
        setAddedItemId(item._id);
        setTimeout(() => setAddedItemId(null), 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
                <div className="text-error-text text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-primary">
            <div className="container mx-auto p-4 sm:p-6">
                <h1 className="text-3xl font-bold mb-8">Menu</h1>
                <div className="mb-6 flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setCategoryFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${categoryFilter === category
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-sm"
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="card p-4 rounded-lg hover:shadow-xl transition-all duration-300">
                            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    onError={handleImageError}
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-primary">{item.title}</h2>
                            <p className="text-secondary">Price: ₹{item.price}</p>
                            <p className="text-secondary">{item.stock} left</p>
                            <p className="text-secondary">Category: {item.category}</p>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className={`mt-4 w-full px-4 py-2 rounded text-button-text transition-all duration-300 transform ${!item.isAvailable || item.stock === 0
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : addedItemId === item._id
                                        ? "bg-green-600 scale-105 transition-transform duration-200 ease-in-out"
                                        : "bg-green-500 hover:bg-green-600 hover:scale-102 active:scale-98 transition-transform duration-200 ease-in-out"
                                    }`}
                                disabled={!item.isAvailable || item.stock === 0}
                            >
                                {item.stock === 0 ? "Out of Stock" : addedItemId === item._id ? "Added!" : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
                {filteredItems.length === 0 && (
                    <p className="text-center text-secondary mt-8">No items found in this category.</p>
                )}
            </div>
        </div>
    );
}

export default Home;