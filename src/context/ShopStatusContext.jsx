// src/context/ShopStatusContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ShopStatusContext = createContext();

export function ShopStatusProvider({ children }) {
    const [shopStatus, setShopStatus] = useState("open");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopStatus = async () => {
            try {
                const now = new Date();
                const hours = now.getHours();
                const isClosed = hours >= 18; // Closed after 6 PM
                setShopStatus(isClosed ? "closed" : "open");
            } catch (error) {
                console.error("Error fetching shop status:", error);
                setShopStatus("open");
            } finally {
                setLoading(false);
            }
        };

        fetchShopStatus();
    }, []);

    return (
        <ShopStatusContext.Provider value={{ shopStatus, loading }}>
            {children}
        </ShopStatusContext.Provider>
    );
}

export const useShopStatus = () => useContext(ShopStatusContext);