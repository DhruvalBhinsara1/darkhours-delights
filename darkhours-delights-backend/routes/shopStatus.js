const express = require("express");
const router = express.Router();
const ShopStatus = require("../models/ShopStatus");
const authenticateAdmin = require("../middleware/auth");

// GET shop status
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const shopStatus = await ShopStatus.findOne();
    if (!shopStatus) {
      // If no status exists, create a default one
      const newStatus = new ShopStatus({ status: "closed" });
      await newStatus.save();
      return res.json(newStatus);
    }
    res.json(shopStatus);
  } catch (error) {
    console.error("Error fetching shop status:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// PUT to update shop status
router.put("/", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const shopStatus = await ShopStatus.findOneAndUpdate(
      {},
      { status, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(shopStatus);
  } catch (error) {
    console.error("Error updating shop status:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;