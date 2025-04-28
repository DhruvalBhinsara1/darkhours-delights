// src/hooks/useShopStatus.js
import { useState, useEffect } from "react";

function useShopStatus() {
    const [shopOpen, setShopOpen] = useState(false);

    useEffect(() => {
        // Here you could check actual shop open/close logic
        const hours = new Date().getHours();
        setShopOpen(hours >= 21 && hours <= 2); // example: shop open from 9AM to 10PM
    }, []);

    return shopOpen;
}

export default useShopStatus;
