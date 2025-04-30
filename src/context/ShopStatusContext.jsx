import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ShopStatusContext = createContext();

export function ShopStatusProvider({ children }) {
  const [shopStatus, setShopStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshShopStatus = async () => {
    try {
      const response = await axios.get("https://web-production-6e9b1.up.railway.app/api/shopStatus");
      setShopStatus(response.data.status);
      setLastUpdated(new Date());
      console.log("Shop status refreshed from API:", response.data.status);
    } catch (error) {
      console.error("Error fetching shop status:", error);
      // Don't set to closed on error, keep previous status
      console.log("Using previous status:", shopStatus);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshShopStatus();

    // Set up event listener for shop status changes
    let eventSource = null;
    let pollingInterval = null;

    const startSSE = () => {
      eventSource = new EventSource("https://web-production-6e9b1.up.railway.app/api/shopStatus/stream");
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setShopStatus(data.status);
          setLastUpdated(new Date());
          console.log("Shop status updated via SSE:", data.status);
          // Reset to SSE if we were polling
          if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection error, falling back to polling");
        eventSource.close();
        eventSource = null;
        startPolling();
      };
    };

    const startPolling = () => {
      pollingInterval = setInterval(() => {
        refreshShopStatus()
          .catch(error => console.error("Polling error:", error))
          .finally(() => {
            // Try to reconnect to SSE after a successful poll
            if (!eventSource) {
              startSSE();
            }
          });
      }, 10000); // Update every 10 seconds
    };

    startSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const isOpen = shopStatus === "open";

  return (
    <ShopStatusContext.Provider value={{ shopStatus, isOpen, loading, refreshShopStatus }}>
      {children}
    </ShopStatusContext.Provider>
  );
}

export const useShopStatus = () => useContext(ShopStatusContext);