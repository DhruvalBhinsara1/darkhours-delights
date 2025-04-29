// models/ShopStatus.js
const mongoose = require("mongoose");

const shopStatusSchema = new mongoose.Schema({
    status: { type: String, enum: ["open", "closed"], required: true },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ShopStatus", shopStatusSchema);