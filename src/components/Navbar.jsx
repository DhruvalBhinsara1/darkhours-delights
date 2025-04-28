import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaLightbulb, FaGoogle, FaSignOutAlt, FaHistory, FaHome, FaStore } from "react-icons/fa";
import { useShopStatus } from "../context/ShopStatusContext"; // Updated import

function Navbar() {
    const { currentUser, login, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const { shopStatus, loading } = useShopStatus(); // Use context hook

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Determine if shop is open based on shopStatus
    const isShopOpen = shopStatus === "open";

    return (
        <nav className="bg-gray-800 text-gray-300 p-4 shadow-md frosted-glass sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center relative">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-300">
                    DarkHours Delights
                </Link>

                {/* Hamburger for Mobile */}
                <button
                    onClick={toggleMenu}
                    className="text-2xl md:hidden focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "✖" : "☰"}
                </button>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <ShopLinks
                        shopOpen={isShopOpen}
                        loading={loading}
                        currentUser={currentUser}
                        login={login}
                        logout={logout}
                    />
                </div>
            </div>

            {/* Mobile Menu with Transition */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col items-start bg-gray-800 p-4 space-y-4 frosted-glass">
                    <ShopLinks
                        shopOpen={isShopOpen}
                        loading={loading}
                        currentUser={currentUser}
                        login={login}
                        logout={logout}
                    />
                </div>
            </div>
        </nav>
    );
}

function ShopLinks({ shopOpen, loading, currentUser, login, logout }) {
    return (
        <>
            {/* Shop Status */}
            <div className="flex items-center space-x-2">
                <FaStore className="text-xl" />
                {loading ? (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-500">
                        Loading...
                    </span>
                ) : (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${shopOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                            }`}
                    >
                        {shopOpen ? "Open" : "Closed"}
                    </span>
                )}
            </div>

            {/* Links */}
            <Link
                to="/"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                aria-label="Home"
            >
                <FaHome className="text-xl" />
                <span>Home</span>
            </Link>
            <Link
                to="/cart"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                aria-label="Cart"
            >
                <FaShoppingCart className="text-xl" />
                <span>Cart</span>
            </Link>
            <Link
                to="/order-history"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                aria-label="Order History"
            >
                <FaHistory className="text-xl" />
                <span>Orders</span>
            </Link>
            <Link
                to="/suggestions"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                aria-label="Suggestions"
            >
                <FaLightbulb className="text-xl" />
                <span>Suggest</span>
            </Link>

            {/* Auth */}
            {currentUser ? (
                <button
                    onClick={logout}
                    className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                    aria-label="Logout"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span>Logout</span>
                </button>
            ) : (
                <button
                    onClick={login}
                    className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
                    aria-label="Login with Google"
                >
                    <FaGoogle className="text-xl" />
                    <span>Login</span>
                </button>
            )}
        </>
    );
}

export default Navbar;