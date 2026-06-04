import React from "react";
import useCart from "../../hooks/useCart";
import "./CartSummary.css";

const CartSummary = ({ onCheckout }) => {
  const { totalAmount } = useCart();

  return (
    <div className="cart-summary">
      <div className="cart-summary-row">
        <span>Total Amount</span>
        <span className="cart-total">₹{totalAmount}</span>
      </div>
      <button className="cart-checkout-btn" onClick={onCheckout}>
        Proceed to Order →
      </button>
    </div>
  );
};

export default CartSummary;