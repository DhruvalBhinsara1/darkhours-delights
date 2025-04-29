const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authenticateAdmin = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:itemId", authenticateAdmin, async (req, res) => {
    try {
        const { stock, isAvailable } = req.body;
        if (typeof stock !== "number" || stock < 0) {
            return res.status(400).json({ error: "Invalid stock value" });
        }
        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({ error: "Invalid isAvailable value" });
        }

        const item = await Item.findByIdAndUpdate(
            req.params.itemId,
            { stock, isAvailable },
            { new: true }
        );
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        console.log("Updated item:", item); // Debug
        res.json(item);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;