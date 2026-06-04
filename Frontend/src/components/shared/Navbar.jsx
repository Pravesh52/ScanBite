import React from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems, tableNumber } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="navbar-logo">🍔 ScanBite</div>
      {tableNumber && (
        <div className="navbar-table">Table: {tableNumber}</div>
      )}
      <button className="navbar-cart" onClick={() => navigate("/cart")}>
        🛒 Cart
        {totalItems > 0 && (
          <span className="navbar-badge">{totalItems}</span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;