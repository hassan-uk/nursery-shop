import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.add({ productId, quantity });
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      const response = await cartAPI.update(id, { quantity });
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await cartAPI.remove(id);
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clear();
      setCart(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
