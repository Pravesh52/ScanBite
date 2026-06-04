import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h2 className="success-heading">Order Place Ho Gaya!</h2>
      <p className="success-sub">Aapka order restaurant ko mil gaya hai.</p>
      <p className="success-sub">Invoice SMS aayega thodi der mein 📩</p>
      <button
        className="success-btn"
        onClick={() => navigate("/menu")}
      >
        ← Wapas Menu Pe Jao
      </button>
    </div>
  );
};

export default OrderSuccess;