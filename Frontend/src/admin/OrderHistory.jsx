import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../services/adminApi";
import Loader from "../components/shared/Loader";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory(selectedDate);
  }, [selectedDate]);

  const loadHistory = (date) => {
    setLoading(true);
    fetchOrderHistory(date)
      .then((data) => {
        setAllOrders(data);
        setOrders(data);
      })
      .catch(() => setError("History load nahi hui"))
      .finally(() => setLoading(false));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setOrders(allOrders);
      return;
    }
    const filtered = allOrders.filter(
      (o) =>
        o.orderID.toLowerCase().includes(value.toLowerCase()) ||
        o.mobile.includes(value) ||
        o.name.toLowerCase().includes(value.toLowerCase())
    );
    setOrders(filtered);
  };

  const totalAmount = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount || 0),
    0
  );

  return (
    <div>
      <h2 className="history-heading">📅 Order History</h2>

      <div className="history-filter">
        <input
          className="history-date-input"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="history-search">
        <input
          className="history-search-input"
          type="text"
          placeholder="🔍 Order ID, Mobile ya Name se search karo"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="history-summary">
        <p>Total Orders: <strong>{orders.length}</strong></p>
        <p>Total Amount: <strong>₹{totalAmount}</strong></p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="history-error">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-history">Koi order nahi mila</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="history-card">
            <div className="history-card-top">
              <span>{order.orderID}</span>
              <span>{order.orderStatus}</span>
            </div>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Mobile:</strong> {order.mobile}</p>
            <p><strong>Table:</strong> {order.table}</p>
            <p><strong>Items:</strong> {order.items}</p>
            <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
            <p><strong>Time:</strong> {order.timeStamp}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;