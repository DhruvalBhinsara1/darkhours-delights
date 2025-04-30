import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaLightbulb, FaGoogle, FaSignOutAlt, FaHistory, FaHome, FaStore, FaUserShield, FaSun, FaMoon } from "react-icons/fa";
import { useShopStatus } from "../context/ShopStatusContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
    const { currentUser, login, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const { shopStatus, loading } = useShopStatus();
    const { theme, toggleTheme } = useTheme();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Determine if shop is open based on shopStatus
    const isShopOpen = shopStatus === "open";

    return (
        <nav className="bg-nav-bg text-nav-text p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center relative">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold whitespace-nowrap text-nav-text flex-1">
                    DarkHours Delights
                </Link>

                {/* Hamburger for Mobile */}
                <div className="flex items-center space-x-4 md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-2xl focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? "✖" : "☰"}
                    </button>
                </div>

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

                <div className="flex items-center space-x-4">
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
                    ) : !currentUser && (
                        <button
                            onClick={login}
                            className="px-4 py-2 rounded-md bg-accent-primary text-button-text hover:bg-accent-hover transition-colors"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-nav-hover transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            <FaMoon className="text-nav-text" size={20} />
                        ) : (
                            <FaSun className="text-nav-text" size={20} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu with Transition */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="flex flex-col items-center w-full bg-nav-bg p-4 space-y-4">
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
            <div className="flex items-center justify-center w-full space-x-2">
                <FaStore className="text-xl text-nav-text" />
                {loading ? (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-nav-text">
                        Loading...
                    </span>
                ) : (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${shopOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                        {shopOpen ? "Open" : "Closed"}
                    </span>
                )}
            </div>

            {/* Links */}
            <Link
                to="/"
                className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                aria-label="Home"
            >
                <FaHome className="text-xl" />
                <span className="md:hidden">Home</span>
            </Link>
            <Link
                to="/cart"
                className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                aria-label="Cart"
            >
                <FaShoppingCart className="text-xl" />
                <span className="md:hidden">Cart</span>
            </Link>
            <Link
                to="/order-history"
                className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                aria-label="Order History"
            >
                <FaHistory className="text-xl" />
                <span className="md:hidden">Orders</span>
            </Link>
            <Link
                to="/suggestions"
                className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                aria-label="Suggestions"
            >
                <FaLightbulb className="text-xl" />
                <span className="md:hidden">Suggest</span>
            </Link>
            {currentUser && (
                <Link
                    to="/admin"
                    className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                    aria-label="Admin Panel"
                >
                    <FaUserShield className="text-xl" />
                    <span className="md:hidden">Admin</span>
                </Link>
            )}

            {/* Auth */}
            {currentUser ? (
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                    aria-label="Logout"
                >
                    <FaSignOutAlt className="text-xl" />
                    <span className="md:hidden">Logout</span>
                </button>
            ) : (
                <button
                    onClick={login}
                    className="flex items-center justify-center w-full space-x-1 focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1 text-nav-text hover:bg-nav-hover"
                    aria-label="Login with Google"
                >
                    <FaGoogle className="text-xl" />
                    <span className="md:hidden">Login</span>
                </button>
            )}
        </>
    );
}

export default Navbar;