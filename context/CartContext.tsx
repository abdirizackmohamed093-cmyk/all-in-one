"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "@/types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("all_in_one_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data", error);
      }
    }
  }, []);

  // Sync cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("all_in_one_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);

      if (existingItem) {
        const potentialQuantity = existingItem.quantity + quantity;
        // Cap at maximum available stock
        const finalQuantity = Math.min(potentialQuantity, newItem.stockCount);
        
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, quantity: finalQuantity } : item
        );
      }

      return [...prevCart, { ...newItem, quantity: Math.min(quantity, newItem.stockCount) }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.stockCount) } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Memoized derived states for performance optimization
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}