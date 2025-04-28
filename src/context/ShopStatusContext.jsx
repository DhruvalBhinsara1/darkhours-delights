// src/context/ShopStatusContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ShopStatusContext = createContext();

export function ShopStatusProvider({ children }) {
    const [shopStatus, setShopStatus] = useState("open");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopStatus = () => {
            try {
                const now = new Date();
                const hours = now.getHours();
                const isOpen = (hours >= 21 && hours <= 23) || (hours >= 0 && hours <= 2); // 9 PM to 2 AM
                setShopStatus(isOpen ? "open" : "closed");
            } catch (error) {
                console.error("Error fetching shop status:", error);
                setShopStatus("open");
            } finally {
                setLoading(false);
            }
        };

        fetchShopStatus();
        const interval = setInterval(fetchShopStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <ShopStatusContext.Provider value={{ shopStatus, loading }}>
            {children}
        </ShopStatusContext.Provider>
    );
}

export const useShopStatus = () => useContext(ShopStatusContext);