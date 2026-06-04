import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === productName ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        tableNumber,
        setTableNumber,
        customerMobile,
        setCustomerMobile,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};