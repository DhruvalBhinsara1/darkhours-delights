import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { FaStore, FaPlus, FaMinus, FaSpinner, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../styles/admin.css";
import { getApiUrl } from '../config/api';

function AdminPanel() {
    const { currentUser, loading: authLoading } = useAuth();
    const [items, setItems] = useState([]);
    const [shopStatus, setShopStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isTogglingShop, setIsTogglingShop] = useState(false);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [newItem, setNewItem] = useState({ title: '', price: '', image: '', category: '' });
    const [isAdmin, setIsAdmin] = useState(null);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
    const [orders, setOrders] = useState([]);
    const [searchPhone, setSearchPhone] = useState("");
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [isLoadingAllOrders, setIsLoadingAllOrders] = useState(false);

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
            console.log("User ID:", currentUser.uid); // Added debug log for user ID
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
                const [itemsResponse, statusResponse] = await Promise.all([
                    axios.get(getApiUrl("api/items"), {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(getApiUrl("api/shopStatus"), {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                console.log("Fetched items:", itemsResponse.data); // Debug
                console.log("Fetched shop status:", statusResponse.data); // Debug
                setItems(itemsResponse.data);
                setShopStatus(statusResponse.data.status);
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
            const response = await axios.post(
                getApiUrl("api/shopStatus"),
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Updated shop status:", response.data);
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

        setError(null);
        setIsTogglingShop(true);

        try {
            const token = await currentUser.getIdToken();
            const response = await axios.put(
                getApiUrl(`api/items/${itemId}/stock`),
                { change: stockChange },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Updated item stock:", response.data);
            setItems(items.map(item =>
                item._id === itemId ? { ...item, stock: item.stock + stockChange } : item
            ));
            alert(`Item stock updated successfully`);
        } catch (e) {
            console.error("Error updating item stock:", e);
            setError(e.response?.data?.error || "Failed to update item stock");
        } finally {
            setIsTogglingShop(false);
        }
    };

    const handleAddItem = async () => {
        if (!currentUser) {
            alert("Please log in as admin.");
            return;
        }

        if (!newItem.title || !newItem.price || !newItem.image || !newItem.category) {
            alert("Please fill in all fields");
            return;
        }

        setError(null);
        setIsTogglingShop(true);

        try {
            const token = await currentUser.getIdToken();
            const response = await axios.post(
                getApiUrl("api/items"),
                {
                    ...newItem,
                    price: parseFloat(newItem.price),
                    stock: 0
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Added new item:", response.data);
            setItems([...items, response.data]);
            setNewItem({ title: '', price: '', image: '', category: '' });
            alert("Item added successfully");
        } catch (e) {
            console.error("Error adding item:", e);
            setError(e.response?.data?.error || "Failed to add item");
        } finally {
            setIsTogglingShop(false);
        }
    };

    const fetchOrdersByPhone = async (phone) => {
        if (!phone) return;
        setIsLoadingOrders(true);
        setError(null);
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(
                getApiUrl(`api/orders/phone/${phone}`),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Orders found:", response.data); // Debug log
            setOrders(response.data);
        } catch (e) {
            console.error("Error fetching orders:", e);
            setError(e.response?.data?.error || "Failed to load orders. Please try again later.");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const fetchAllOrders = async (page) => {
        setIsLoadingAllOrders(true);
        setError(null);
        try {
            const token = await currentUser.getIdToken();
            const response = await axios.get(
                getApiUrl(`api/orders/all/${page}`),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (e) {
            console.error("Error fetching all orders:", e);
            setError("Failed to load orders. Please try again later.");
        } finally {
            setIsLoadingAllOrders(false);
        }
    };

    useEffect(() => {
        if (showAllOrders) {
            fetchAllOrders(1);
        }
    }, [showAllOrders]);

    return (
        <div className="admin-panel">
            {isCheckingAdmin ? (
                <div className="loading">
                    <FaSpinner className="animate-spin text-2xl text-blue-500" />
                </div>
            ) : isAdmin ? (
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <FaStore className="text-blue-500" /> Admin Panel
                        </h1>
                        <div className="text-sm text-gray-400">
                            Welcome, {currentUser?.email}
                        </div>
                    </div>

                    <div className="admin-section">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Shop Status</h2>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${shopStatus === "open"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                                }`}>
                                {shopStatus === "open" ? "Open" : "Closed"}
                            </span>
                        </div>
                        <div className="shop-status">
                            <button
                                onClick={handleToggleShop}
                                disabled={isTogglingShop}
                                className={`toggle-button ${shopStatus === "open" ? "open" : "closed"}`}
                            >
                                {isTogglingShop ? (
                                    <FaSpinner className="animate-spin mr-2" />
                                ) : null}
                                {isTogglingShop ? "Updating..." : shopStatus === "open" ? "Close Shop" : "Open Shop"}
                            </button>
                            {error && <div className="error">{error}</div>}
                        </div>
                    </div>

                    <div className="admin-section">
                        <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
                        <form className="add-item-form" onSubmit={(e) => { e.preventDefault(); handleAddItem(); }}>
                            <div className="form-group">
                                <label className="text-gray-400">Title</label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className="w-full p-2 bg-gray-800 text-white rounded"
                                    placeholder="Enter item title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-gray-400">Price (₹)</label>
                                <input
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                    className="w-full p-2 bg-gray-800 text-white rounded"
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-gray-400">Image URL</label>
                                <input
                                    type="text"
                                    value={newItem.image}
                                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                    className="w-full p-2 bg-gray-800 text-white rounded"
                                    placeholder="Enter image URL"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-gray-400">Category</label>
                                <input
                                    type="text"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full p-2 bg-gray-800 text-white rounded"
                                    placeholder="Enter category"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isTogglingShop}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isTogglingShop ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaPlus />
                                )}
                                {isTogglingShop ? "Adding..." : "Add Item"}
                            </button>
                        </form>
                    </div>

                    <div className="admin-section">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Items Management</h2>
                            <span className="text-gray-400">{items.length} items</span>
                        </div>
                        {isLoadingData ? (
                            <div className="loading">
                                <FaSpinner className="animate-spin text-2xl text-blue-500" />
                            </div>
                        ) : (
                            <div className="items-grid">
                                {items.map((item) => (
                                    <div key={item._id} className="item-card">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-semibold">{item.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                                }`}>
                                                {item.isAvailable ? "Available" : "Out of Stock"}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-400">Price: ₹{item.price}</p>
                                            <p className="text-gray-400">Stock: {item.stock}</p>
                                            <p className="text-gray-400">Category: {item.category}</p>
                                        </div>
                                        <div className="stock-controls mt-4">
                                            <button
                                                onClick={() => handleUpdateItem(item._id, 1)}
                                                disabled={isTogglingShop}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FaPlus className="mr-1" /> Add Stock
                                            </button>
                                            <button
                                                onClick={() => handleUpdateItem(item._id, -1)}
                                                disabled={isTogglingShop || item.stock <= 0}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                <FaMinus className="mr-1" /> Remove Stock
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="admin-section">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Customer Orders</h2>
                            <button
                                onClick={() => setShowAllOrders(!showAllOrders)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                            >
                                {showAllOrders ? (
                                    <>
                                        <FaChevronUp />
                                        Hide All Orders
                                    </>
                                ) : (
                                    <>
                                        <FaChevronDown />
                                        Show All Orders
                                    </>
                                )}
                            </button>
                        </div>

                        {showAllOrders ? (
                            <>
                                {isLoadingAllOrders ? (
                                    <div className="loading">
                                        <FaSpinner className="animate-spin text-2xl text-blue-500" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-gray-700">
                                                        <th className="py-3 px-4">Order ID</th>
                                                        <th className="py-3 px-4">Phone</th>
                                                        <th className="py-3 px-4">Date</th>
                                                        <th className="py-3 px-4">Items</th>
                                                        <th className="py-3 px-4">Total</th>
                                                        <th className="py-3 px-4">Delivery Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allOrders.map((order) => (
                                                        <tr key={order.orderId} className="border-b border-gray-700 hover:bg-gray-800">
                                                            <td className="py-3 px-4">{order.orderId}</td>
                                                            <td className="py-3 px-4">{order.phone}</td>
                                                            <td className="py-3 px-4">
                                                                {new Date(order.timestamp).toLocaleString()}
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <ul className="list-disc list-inside">
                                                                    {order.items.map((item) => (
                                                                        <li key={item._id}>
                                                                            {item.title} (x{item.quantity})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </td>
                                                            <td className="py-3 px-4">₹{order.total}</td>
                                                            <td className="py-3 px-4">
                                                                Room {order.room}, Block {order.block}, Floor {order.floor}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button
                                                onClick={() => fetchAllOrders(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-4 py-2">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => fetchAllOrders(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="tel"
                                            value={searchPhone}
                                            onChange={(e) => setSearchPhone(e.target.value)}
                                            placeholder="Enter Customer Phone Number"
                                            className="flex-1 p-2 bg-gray-800 text-white rounded"
                                        />
                                        <button
                                            onClick={() => fetchOrdersByPhone(searchPhone)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <FaSearch />
                                            Search
                                        </button>
                                    </div>
                                </div>
                                {isLoadingOrders ? (
                                    <div className="loading">
                                        <FaSpinner className="animate-spin text-2xl text-blue-500" />
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="py-3 px-4">Order ID</th>
                                                    <th className="py-3 px-4">Date</th>
                                                    <th className="py-3 px-4">Items</th>
                                                    <th className="py-3 px-4">Total</th>
                                                    <th className="py-3 px-4">Delivery Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.orderId} className="border-b border-gray-700 hover:bg-gray-800">
                                                        <td className="py-3 px-4">{order.orderId}</td>
                                                        <td className="py-3 px-4">
                                                            {new Date(order.timestamp).toLocaleString()}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <ul className="list-disc list-inside">
                                                                {order.items.map((item) => (
                                                                    <li key={item._id}>
                                                                        {item.title} (x{item.quantity})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td className="py-3 px-4">₹{order.total}</td>
                                                        <td className="py-3 px-4">
                                                            Room {order.room}, Block {order.block}, Floor {order.floor}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : searchPhone ? (
                                    <p className="text-center text-gray-400 py-4">No orders found for this phone number.</p>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <Navigate to="/" />
            )}
        </div>
    );
}

export default AdminPanel;