import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useShopStatus } from '../context/ShopStatusContext';

const ItemCard = ({ item }) => {
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const { isOpen } = useShopStatus();

    const handleAddToCart = () => {
        if (!currentUser) {
            alert('Please log in to add items to cart');
            return;
        }
        if (!isOpen) {
            alert('Sorry, the shop is currently closed');
            return;
        }
        addToCart(item);
    };

    return (
        <div className="card">
            <div className="image-container overflow-hidden">
                <img
                    src={item.imageUrl || '/placeholder.jpg'}
                    alt={item.name}
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />
            </div>
            <div className="card-content">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-sm mb-1">Price: ₹{item.price}</p>
                <p className="text-sm mb-1">{item.stock} left</p>
                <p className="text-sm mb-3">Category: {item.category}</p>
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
                    disabled={!isOpen}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ItemCard;