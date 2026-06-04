import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import OtpForm from "../Order/OtpForm";
import OrderForm from "../Order/OrderForm";
import useCart from "../../hooks/useCart";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, isVerified } = useCart();
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <p>🛒 Cart khali hai!</p>
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          ← Menu pe Jao
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="cart-heading">Your Cart 🛒</h2>
      {cartItems.map((item, i) => (
        <CartItem key={i} item={item} />
      ))}
      {!showOtp && !isVerified && (
        <CartSummary onCheckout={() => setShowOtp(true)} />
      )}
      {showOtp && !isVerified && <OtpForm />}
      {isVerified && <OrderForm />}
    </div>
  );
};

export default CartPage;