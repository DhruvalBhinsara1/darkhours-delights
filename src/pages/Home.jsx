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
        // Mock data
        setCategories([
            { _id: "1", name: "All" },
            { _id: "2", name: "Chips" },
            { _id: "3", name: "Beverages" },
            { _id: "4", name: "Chocolates" },
            { _id: "5", name: "Snacks" },
            { _id: "6", name: "Candies" },
        ]);
        setItems([
            { _id: "101", title: "Lays Classic", price: 20, stock: 15, image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTJZ39dEZkjpgIxLb35VbJOoqlToh3gH6HQRTJF12wxFfs6RMNA3vTWYEOOsMJhPcElZxS2Ru5VyUXXpknoZVhCOLVr3KJRZJ-19I2C3pZW_Kxuan1GbWzpuQ", category: "2" },
            { _id: "102", title: "Lays Masala", price: 20, stock: 12, image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcROvs519ZgZuTRjuqJRppnrI3z6Kzq1A0qRUyahpXaem9gmEOl1NfwGY4AS2oXNH1qoIbHYgL3ApPQ0En0ysiThUIXNvv9qt5Scdqmpv2AlzIvV7i-owbBg", category: "2" },
            { _id: "103", title: "Pringles Original", price: 50, stock: 8, image: "pringles-original.jpg", category: "2" },
            { _id: "104", title: "Kurkure", price: 15, stock: 20, image: "kurkure.jpg", category: "2" },
            { _id: "105", title: "Coke 250ml", price: 25, stock: 10, image: "coke-250ml.jpg", category: "3" },
            { _id: "106", title: "Pepsi 300ml", price: 25, stock: 10, image: "pepsi-300ml.jpg", category: "3" },
            { _id: "107", title: "Sprite 250ml", price: 25, stock: 15, image: "sprite-250ml.jpg", category: "3" },
            { _id: "108", title: "Fanta 250ml", price: 25, stock: 12, image: "fanta-250ml.jpg", category: "3" },
            { _id: "109", title: "Dairy Milk Silk", price: 15, stock: 10, image: "dairymilk-silk.jpg", category: "4" },
            { _id: "110", title: "KitKat", price: 10, stock: 20, image: "kitkat.jpg", category: "4" },
            { _id: "111", title: "Snickers", price: 20, stock: 15, image: "snickers.jpg", category: "4" },
            { _id: "112", title: "Ferrero Rocher", price: 50, stock: 5, image: "ferrero-rocher.jpg", category: "4" },
            { _id: "113", title: "Bhel Puri", price: 30, stock: 10, image: "bhel-puri.jpg", category: "5" },
            { _id: "114", title: "Samosa", price: 25, stock: 8, image: "samosa.jpg", category: "5" },
            { _id: "115", title: "Pani Puri", price: 20, stock: 12, image: "pani-puri.jpg", category: "5" },
            { _id: "116", title: "Skittles", price: 15, stock: 20, image: "skittles.jpg", category: "6" },
            { _id: "117", title: "M&M's", price: 15, stock: 15, image: "mms.jpg", category: "6" },
            { _id: "118", title: "Jelly Beans", price: 10, stock: 25, image: "jelly-beans.jpg", category: "6" },
        ]);
        setLoading(false);
    }, []);

    const handleAddToCart = (item, quantity) => {
        addToCart(item, quantity);
        alert(`${item.title} added to cart!`);
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Shop Snacks</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                    <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category._id)}
                        className={`px-4 py-2 rounded ${selectedCategory === category._id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.length === 0 ? (
                    <p>No items available.</p>
                ) : (
                    items
                        .filter((item) => selectedCategory === "1" || item.category === selectedCategory)
                        .map((item) => (
                            <ItemCard key={item._id} item={item} addToCart={handleAddToCart} />
                        ))
                )}
            </div>
        </div>
    );
}

export default Home;
