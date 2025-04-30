// src/context/ShopStatusContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from '../config/api';

const ShopStatusContext = createContext();

export function ShopStatusProvider({ children }) {
  const [shopStatus, setShopStatus] = useState("open");
  const [loading, setLoading] = useState(true);

  const refreshShopStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl("api/shopStatus"));
      setShopStatus(response.data.status);
      console.log("Shop status refreshed from API:", response.data.status);
    } catch (error) {
      console.error("Error fetching shop status:", error);
      setShopStatus("closed"); // Default to closed on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshShopStatus();
    const interval = setInterval(refreshShopStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <ShopStatusContext.Provider value={{ shopStatus, loading, refreshShopStatus }}>
      {children}
    </ShopStatusContext.Provider>
  );
}

export const useShopStatus = () => useContext(ShopStatusContext);