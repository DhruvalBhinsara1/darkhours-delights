import { useState, useEffect } from "react";
import axios from "axios";

function ShopStatus() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Mock shop status for now
        setIsOpen(false);
        // Uncomment when backend is ready
        /*
        axios
          .get("/api/shop/status")
          .then((res) => setIsOpen(res.data.isOpen))
          .catch((err) => console.error("Failed to fetch shop status:", err));
        */
    }, []);

    return (
        <div
            className={`text-sm ${isOpen ? "text-green-400" : "text-red-400"
                } mb-2 md:mb-0`}
        >
            Shop is {isOpen ? "Open" : "Closed"}
        </div>
    );
}

export default ShopStatus;