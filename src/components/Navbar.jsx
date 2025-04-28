import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaLightbulb, FaGoogle, FaSignOutAlt, FaHistory, FaHome, FaStore } from "react-icons/fa";
import useShopStatus from "../hooks/useShopStatus";

function Navbar() {
    const { user, login, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const shopOpen = useShopStatus();

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center relative">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">
                    DarkHours Delights
                </Link>

                {/* Hamburger */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl md:hidden">
                    {menuOpen ? "✖" : "☰"}
                </button>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <ShopLinks shopOpen={shopOpen} user={user} login={login} logout={logout} />
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="flex flex-col items-start bg-gray-800 p-4 space-y-4 md:hidden">
                    <ShopLinks shopOpen={shopOpen} user={user} login={login} logout={logout} />
                </div>
            )}
        </nav>
    );
}

function ShopLinks({ shopOpen, user, login, logout }) {
    return (
        <>
            {/* Shop Status */}
            <div className="flex items-center space-x-2">
                <FaStore className="text-xl" />
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${shopOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`}>
                    {shopOpen ? "Open" : "Closed"}
                </span>
            </div>

            {/* Links */}
            <Link to="/" className="flex items-center hover:text-gray-300">
                <FaHome className="text-xl mr-1" />
                <span>Home</span>
            </Link>
            <Link to="/cart" className="flex items-center hover:text-gray-300">
                <FaShoppingCart className="text-xl mr-1" />
                <span>Cart</span>
            </Link>
            <Link to="/order-history" className="flex items-center hover:text-gray-300">
                <FaHistory className="text-xl mr-1" />
                <span>Orders</span>
            </Link>
            <Link to="/suggestions" className="flex items-center hover:text-gray-300">
                <FaLightbulb className="text-xl mr-1" />
                <span>Suggest</span>
            </Link>

            {/* Auth */}
            {user ? (
                <button onClick={logout} className="flex items-center hover:text-gray-300">
                    <FaSignOutAlt className="text-xl mr-1" />
                    <span>Logout</span>
                </button>
            ) : (
                <button onClick={login} className="flex items-center hover:text-gray-300">
                    <FaGoogle className="text-xl mr-1" />
                    <span>Login</span>
                </button>
            )}
        </>
    );
}

export default Navbar;
