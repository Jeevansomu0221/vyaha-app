// app/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Add item (if exists, increase qty)
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.name === item.name &&
          i.product === item.product &&
          i.restaurant === item.restaurant &&
          i.unit === item.unit
      );

      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ Remove item completely
  const removeFromCart = (item) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.name === item.name &&
            i.product === item.product &&
            i.restaurant === item.restaurant &&
                      i.unit === item.unit
          )
      )
    );
  };

  // ✅ Decrease qty (remove if qty=1)
  const decreaseQuantity = (item) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.name === item.name &&
          i.product === item.product &&
          i.restaurant === item.restaurant &&
           i.unit === item.unit
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ✅ Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
