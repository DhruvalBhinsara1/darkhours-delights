import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:5005/api/items");
                console.log("Fetched items:", response.data); // Debug
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

    if (loading) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="text-red-400 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen p-6">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-white text-center">DarkHours Delights</h1>
                <div className="mb-6">
                    <label htmlFor="category" className="text-lg mr-2">Filter by Category:</label>
                    <select
                        id="category"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-t-lg mb-4"
                            />
                            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                            <p className="text-gray-400">Price: ₹{item.price}</p>
                            <p className="text-gray-400">Stock: {item.stock}</p>
                            <p className="text-gray-400">Category: {item.category}</p>
                            <button
                                onClick={() => addToCart({
                                    _id: item._id,
                                    title: item.title,
                                    price: item.price,
                                    quantity: 1,
                                })}
                                className={`mt-4 w-full px-4 py-2 rounded text-white transition-colors ${
                                    !item.isAvailable || item.stock === 0
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                disabled={!item.isAvailable || item.stock === 0}
                            >
                                {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
                {filteredItems.length === 0 && (
                    <p className="text-center text-gray-400 mt-8">No items found in this category.</p>
                )}
            </div>
        </div>
    );
}

export default Home;