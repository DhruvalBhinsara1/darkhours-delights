import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { FaStore, FaPlus, FaMinus } from "react-icons/fa";

function AdminPanel() {
    const { currentUser, loading: authLoading } = useAuth();
    const [items, setItems] = useState([]);
    const [shopStatus, setShopStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isTogglingShop, setIsTogglingShop] = useState(false);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!currentUser) {
            setIsCheckingAdmin(false);
            return;
        }

        // Check admin status
        currentUser.getIdTokenResult().then((idTokenResult) => {
            const adminStatus = !!idTokenResult.claims.admin;
            setIsAdmin(adminStatus);
            console.log("Admin status:", adminStatus, "Claims:", idTokenResult.claims); // Debug
            if (!adminStatus) {
                console.log("User is not an admin, redirecting to /");
            }
            setIsCheckingAdmin(false);
        }).catch((e) => {
            console.error("Error checking admin status:", e);
            setError("Failed to verify admin status");
            setIsCheckingAdmin(false);
        });

        const fetchData = async () => {
            try {
                const token = await currentUser.getIdToken();
                console.log("Fetching data with token:", token.slice(0, 20) + "..."); // Debug
                const [itemsRes, statusRes] = await Promise.all([
                    axios.get("http://localhost:5005/api/items", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:5005/api/shopStatus", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                console.log("Fetched items:", itemsRes.data); // Debug
                console.log("Fetched shop status:", statusRes.data); // Debug
                setItems(itemsRes.data);
                setShopStatus(statusRes.data.status);
            } catch (e) {
                console.error("Error fetching admin data:", e);
                setError(e.response?.data?.error || "Failed to load admin panel data");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [currentUser, authLoading]);

    const handleToggleShop = async () => {
        if (!currentUser) {
            alert("Please log in as admin.");
            return;
        }

        setIsTogglingShop(true);
        setError(null);

        try {
            const token = await currentUser.getIdToken();
            console.log("Toggling shop with token:", token.slice(0, 20) + "..."); // Debug
            const newStatus = shopStatus === "open" ? "closed" : "open";
            const response = await axios.put(
                "http://localhost:5005/api/shopStatus",
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Updated shop status:", response.data); // Debug
            setShopStatus(newStatus);
            alert(`Shop is now ${newStatus}.`);
        } catch (e) {
            console.error("Error toggling shop status:", e);
            setError(e.response?.data?.error || "Failed to update shop status");
        } finally {
            setIsTogglingShop(false);
        }
    };

    const handleUpdateItem = async (itemId, stockChange) => {
        if (!currentUser) {
            alert("Please log in as admin.");
            return;
        }

        const item = items.find((i) => i._id === itemId);
        if (!item) return;

        const newStock = item.stock + stockChange;
        if (newStock < 0) {
            setError("Stock cannot be negative.");
            return;
        }

        setUpdatingItem(itemId);
        setError(null);

        try {
            const token = await currentUser.getIdToken();
            console.log("Updating item with token:", token.slice(0, 20) + "..."); // Debug
            const updatedData = {
                stock: newStock,
                isAvailable: newStock > 0,
            };
            const response = await axios.put(
                `http://localhost:5005/api/items/${itemId}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Updated item:", response.data); // Debug
            setItems(
                items.map((i) =>
                    i._id === itemId ? { ...i, stock: newStock, isAvailable: newStock > 0 } : i
                )
            );
        } catch (e) {
            console.error("Error updating item:", e);
            setError(e.response?.data?.error || "Failed to update item");
        } finally {
            setUpdatingItem(null);
        }
    };

    if (authLoading || isCheckingAdmin || isLoadingData) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Loading admin panel...</p>
            </div>
        );
    }

    if (!currentUser) {
        console.log("No user logged in, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    if (isAdmin === false) {
        console.log("User is not admin, redirecting to /");
        return <Navigate to="/" replace />;
    }

    if (error) {
        return (
            <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen p-6">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-6 flex items-center">
                    <FaStore className="mr-2" /> Admin Panel
                </h2>
                <p className="mb-4">User UID: {currentUser.uid}</p>
                <div className="mb-6">
                    <button
                        onClick={handleToggleShop}
                        disabled={isTogglingShop}
                        className={`px-4 py-2 rounded font-semibold flex items-center ${
                            isTogglingShop
                                ? "bg-gray-600 cursor-not-allowed"
                                : shopStatus === "open"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        <FaStore className="mr-2" />
                        {isTogglingShop
                            ? "Updating..."
                            : shopStatus === "open"
                            ? "Close Shop"
                            : "Open Shop"}
                    </button>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Inventory</h3>
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item._id}
                            className="bg-gray-800 p-4 rounded shadow flex items-center justify-between"
                        >
                            <div>
                                <span className="font-semibold">{item.title}</span> - Stock: {item.stock} - Price: ₹
                                {item.price}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleUpdateItem(item._id, 1)}
                                    disabled={updatingItem === item._id}
                                    className={`px-3 py-1 rounded flex items-center ${
                                        updatingItem === item._id
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                >
                                    <FaPlus className="mr-1" />
                                    +1
                                </button>
                                <button
                                    onClick={() => handleUpdateItem(item._id, -1)}
                                    disabled={updatingItem === item._id || item.stock === 0}
                                    className={`px-3 py-1 rounded flex items-center ${
                                        updatingItem === item._id || item.stock === 0
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-red-500 hover:bg-red-600"
                                    }`}
                                >
                                    <FaMinus className="mr-1" />
                                    -1
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminPanel;