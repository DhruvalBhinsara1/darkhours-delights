// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }, // True if stock > 0
});

module.exports = mongoose.model("Item", itemSchema);