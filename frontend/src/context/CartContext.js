import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [cartRestaurant, setCartRestaurant] = useState(() => {
    const saved = localStorage.getItem('cartRestaurant');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('cartRestaurant', cartRestaurant ? JSON.stringify(cartRestaurant) : '');
  }, [cartRestaurant]);

  const addToCart = useCallback((item, restaurant) => {
    if (cartRestaurant && cartRestaurant._id !== restaurant._id && cartItems.length > 0) {
      toast.error('Your cart has items from another restaurant. Clear cart first?', {
        action: { label: 'Clear', onClick: () => clearCart() }
      });
      return false;
    }

    setCartRestaurant(restaurant);
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        toast.success('Quantity updated!');
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      toast.success(`${item.name} added to cart! 🛒`);
      return [...prev, { ...item, quantity: 1 }];
    });
    return true;
  }, [cartRestaurant, cartItems]);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i._id !== itemId);
      if (updated.length === 0) setCartRestaurant(null);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) { removeFromCart(itemId); return; }
    setCartItems(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartRestaurant(null);
  }, []);

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? (cartRestaurant?.deliveryFee || 30) : 0;
  const taxes = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + taxes;

  return (
    <CartContext.Provider value={{
      cartItems, cartRestaurant, totalItems, totalAmount,
      deliveryFee, taxes, grandTotal,
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
