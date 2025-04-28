import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item, quantity) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity }];
        });
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) {
            setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
        } else {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item._id === itemId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);