import { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { useCart } from "../context/CartContext";

function Home() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("1");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        setCategories([
            { _id: "1", name: "All" },
            { _id: "2", name: "Chips" },
            { _id: "3", name: "Beverages" },
            { _id: "4", name: "Chocolates" },
            { _id: "5", name: "Candies" },
        ]);
        setItems([
            {
                _id: "101",
                title: "Lays Classic Salted",
                price: 20,
                stock: 15,
                image: "https://m.media-amazon.com/images/I/7188t60sWoL.jpg",
                category: "2",
            },
            {
                _id: "102",
                title: "Lays Masala",
                price: 20,
                stock: 0,
                image: "https://www.bigbasket.com/media/uploads/p/l/102750_17-lays-potato-chips-indias-magic-masala.jpg",
                category: "2",
            },
            {
                _id: "103",
                title: "Pringles Original",
                price: 50,
                stock: 8,
                image:
                    "https://m.media-amazon.com/images/I/71-7xPT-n0L.jpg",
                category: "2",
            },
            {
                _id: "104",
                title: "Kurkure Masala Munch",
                price: 15,
                stock: 20,
                image: "https://rukminim3.flixcart.com/image/850/1000/l5iid8w0/snack-savourie/t/c/i/-original-imagg65fez3mdsf5.jpeg?q=20",
                category: "2",
            },
            {
                _id: "105",
                title: "Coke 250ml",
                price: 25,
                stock: 10,
                image:
                    "https://www.coca-cola.com/content/dam/brands/global/coca-cola/images/2022/09/coca-cola-250ml.png",
                category: "3",
            },
            {
                _id: "106",
                title: "Pepsi 300ml",
                price: 25,
                stock: 10,
                image: "https://www.pepsi.com/en-us/uploads/images/pepsi-300ml.png",
                category: "3",
            },
            {
                _id: "107",
                title: "Sprite 250ml",
                price: 25,
                stock: 0,
                image:
                    "https://www.sprite.com/content/dam/brands/sprite/global/images/sprite-250ml.png",
                category: "3",
            },
            {
                _id: "108",
                title: "Fanta 250ml",
                price: 25,
                stock: 12,
                image:
                    "https://www.fanta.com/content/dam/brands/fanta/global/images/fanta-orange-250ml.png",
                category: "3",
            },
            {
                _id: "109",
                title: "Dairy Milk Silk",
                price: 15,
                stock: 10,
                image:
                    "https://www.cadbury.co.in/sites/default/files/2020-09/Dairy-Milk-Silk.png",
                category: "4",
            },
            {
                _id: "110",
                title: "KitKat",
                price: 10,
                stock: 0,
                image: "https://www.kitkat.com/images/products/kitkat-chunky.png",
                category: "4",
            },
            {
                _id: "111",
                title: "Snickers",
                price: 20,
                stock: 15,
                image:
                    "https://www.snickers.com/sites/g/files/flyfud143/files/2022-03/snickers-single.png",
                category: "4",
            },
            {
                _id: "112",
                title: "Ferrero Rocher",
                price: 50,
                stock: 5,
                image:
                    "https://www.ferrero.com/content/dam/ferrero-products/rocher/ferrero-rocher.png",
                category: "4",
            },
            {
                _id: "113",
                title: "Skittles",
                price: 15,
                stock: 0,
                image:
                    "https://www.skittles.com/sites/g/files/flyfud143/files/2022-03/skittles-original.png",
                category: "5",
            },
            {
                _id: "114",
                title: "M&M's",
                price: 15,
                stock: 15,
                image:
                    "https://www.mms.com/sites/g/files/flyfud143/files/2022-03/mms-milk-chocolate.png",
                category: "5",
            },
            {
                _id: "115",
                title: "Jelly Beans",
                price: 10,
                stock: 25,
                image: "https://via.placeholder.com/150?text=Jelly+Beans",
                category: "5",
            },
        ]);
        setLoading(false);
    }, []);

    const handleAddToCart = (item, quantity) => {
        addToCart(item, quantity);
        alert(`${item.title} added to cart!`);
    };

    if (loading) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500 mb-4"
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
                    <p>Loading snacks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 text-red-500 min-h-screen flex items-center justify-center">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <div className="container mx-auto px-2 xs:px-4 sm:px-4 py-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">
                    Shop Snacks
                </h1>
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            onClick={() => setSelectedCategory(category._id)}
                            className={`px-5 py-2 rounded-full frosted-glass transition-all duration-300 transform ${selectedCategory === category._id
                                ? "bg-blue-600 text-white scale-105 shadow-lg"
                                : "bg-gray-800 bg-opacity-50 text-gray-200 hover:bg-blue-500 hover:bg-opacity-70 hover:text-white hover:scale-105"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {items.length === 0 ? (
                        <p className="text-gray-400 col-span-full text-center">
                            No items available.
                        </p>
                    ) : (
                        items
                            .filter(
                                (item) =>
                                    selectedCategory === "1" || item.category === selectedCategory
                            )
                            .map((item) => (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    addToCart={handleAddToCart}
                                />
                            ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;