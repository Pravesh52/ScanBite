import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { placeOrder } from "../../services/api";
import "./OrderForm.css";

const OrderForm = () => {
  const { cartItems, totalAmount, tableNumber, customerMobile, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    paymentMethod: "COD",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError("Naam zaroori hai");
      return;
    }

    const orderData = {
      name: form.name,
      mobile: customerMobile,
      email: form.email,
      paymentMethod: form.paymentMethod,
      table: tableNumber,
      items: cartItems.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
      totalAmount,
    };

    setLoading(true);
    try {
      await placeOrder(orderData);
      clearCart();
      navigate("/order-success");
    } catch {
      setError("Order place nahi hua. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form">
      <h3 className="order-form-heading">Your Details 📝</h3>
      {error && <p className="order-error">{error}</p>}

      <input
        className="order-input"
        name="name"
        placeholder="Aapka Naam *"
        value={form.name}
        onChange={handleChange}
      />
      <input
        className="order-input"
        value={customerMobile}
        disabled
        placeholder="Mobile Number"
      />
      <input
        className="order-input"
        name="email"
        placeholder="Email (Optional)"
        value={form.email}
        onChange={handleChange}
      />

      <select
        className="order-input"
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Online Payment</option>
      </select>

      <div className="order-total">Total: ₹{totalAmount}</div>

      <button
        className="order-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Order place ho raha hai..." : "Place Order 🍽️"}
      </button>
    </div>
  );
};

export default OrderForm;