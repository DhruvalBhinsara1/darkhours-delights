// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true }, // Firebase UID
    timestamp: { type: Date, required: true },
    total: { type: Number, required: true },
    items: [
        {
            _id: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    phone: { type: String, required: true },
    room: { type: String, required: true },
    block: { type: String, required: true, enum: ["A", "B", "C"] },
    floor: { type: Number, required: true, min: 0, max: 4 },
});

module.exports = mongoose.model("Order", orderSchema);