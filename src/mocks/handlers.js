import { rest } from "msw";

export const handlers = [
    // Existing handlers...
    rest.get("/api/categories", (req, res, ctx) => {
        return res(
            ctx.json([
                { _id: "1", name: "Chips" },
                { _id: "2", name: "Beverages" },
                { _id: "3", name: "Chocolates" },
            ])
        );
    }),
    rest.get("/api/items", (req, res, ctx) => {
        return res(
            ctx.json([
                { _id: "101", title: "Lays", price: 20, image: "lays.jpg", stock: 10 },
                { _id: "102", title: "Coke", price: 25, image: "coke.jpg", stock: 5 },
            ])
        );
    }),
    rest.post("/api/cart/add", (req, res, ctx) => {
        return res(ctx.json({ success: true }));
    }),
    // New cart handler
    rest.get("/api/cart", (req, res, ctx) => {
        return res(
            ctx.json({
                items: [
                    { _id: "101", title: "Lays", price: 20, quantity: 2 },
                    { _id: "102", title: "Coke", price: 25, quantity: 1 },
                ],
                total: 65,
            })
        );
    }),
    rest.post("/api/cart/update", (req, res, ctx) => {
        return res(
            ctx.json({
                items: [
                    { _id: "101", title: "Lays", price: 20, quantity: req.body.quantity },
                    { _id: "102", title: "Coke", price: 25, quantity: 1 },
                ],
                total: req.body.quantity * 20 + 25,
            })
        );
    }),
];