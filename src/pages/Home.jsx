import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { getApiUrl } from '../config/api';
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/AuroraBackground";
import { useTheme } from "../context/ThemeContext";

function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const { addToCart } = useCart();
    const [addedItemId, setAddedItemId] = useState(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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

    const getOrderedCategories = (items) => {
        const categoryOrder = ["all", "food", "snack", "beverage"];
        const uniqueCategories = new Set(items.map(item => item.category.toLowerCase()));
        return ["all", ...Array.from(uniqueCategories)].sort((a, b) => {
            const indexA = categoryOrder.indexOf(a.toLowerCase());
            const indexB = categoryOrder.indexOf(b.toLowerCase());
            return indexA - indexB;
        });
    };

    const categories = getOrderedCategories(items);

    const filteredItems = categoryFilter === "all" ? items : items.filter((item) =>
        item.category.toLowerCase() === categoryFilter.toLowerCase()
    );

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
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center h-screen"
                >
                    <div className="text-2xl text-white">Loading...</div>
                </motion.div>
            </AuroraBackground>
        );
    }

    if (error) {
        return (
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex items-center justify-center h-screen"
                >
                    <div className="text-error-text text-xl">{error}</div>
                </motion.div>
            </AuroraBackground>
        );
    }

    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="container mx-auto px-4 py-6 flex flex-col items-center"
            >
                <h1 className="text-5xl font-bold mb-2 text-white">Menu</h1>
                <div className="flex flex-col items-center mb-6">
                    <div className="h-px w-48 bg-gray-400/30 mb-3"></div>
                    <p className="text-sm text-gray-300 text-center max-w-lg">
                        <span className="text-red-500 mr-1">*</span>
                        This website is only for Tagore Bhawan C and if you place order from other hostel you won't get a refund
                    </p>
                    <div className="h-px w-48 bg-gray-400/30 mt-3"></div>
                </div>
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
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
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full max-w-7xl mx-auto">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="card p-3 md:p-4 rounded-lg hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-md">
                            <div className="relative w-full h-48 md:h-64 mb-3 md:mb-4 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    onError={handleImageError}
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                                {item.title}
                            </h2>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                Price: ₹{item.price}
                            </p>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                {item.stock} left
                            </p>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                                Category: {item.category}
                            </p>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className={`mt-4 w-full px-4 py-2 rounded text-white transition-all duration-300 transform ${!item.isAvailable || item.stock === 0
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : addedItemId === item._id
                                        ? "bg-green-600 scale-105"
                                        : "bg-green-500 hover:bg-green-600 hover:scale-102 active:scale-98"
                                    }`}
                                disabled={!item.isAvailable || item.stock === 0}
                            >
                                {item.stock === 0 ? "Out of Stock" : addedItemId === item._id ? "Added!" : "Add to Cart"}
                            </button>
                        </div>
                    ))}
                </div>
                {filteredItems.length === 0 && (
                    <p className={`text-center mt-8 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        No items found in this category.
                    </p>
                )}
            </motion.div>
        </AuroraBackground>
    );
}

export default Home;