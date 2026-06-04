import React from "react";
import useCart from "../../hooks/useCart";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-name">{item.name}</div>
      <div className="cart-item-controls">
        <button className="cart-qty-btn" onClick={() => removeFromCart(item.name)}>−</button>
        <span className="cart-qty">{item.qty}</span>
        <button className="cart-qty-btn" onClick={() => addToCart(item)}>+</button>
      </div>
      <div className="cart-item-price">₹{item.price * item.qty}</div>
    </div>
  );
};

export default CartItem;