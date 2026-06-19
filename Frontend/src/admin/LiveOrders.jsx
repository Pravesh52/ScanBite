import React, { useEffect, useState, useRef } from "react";
import { fetchAllOrders, cancelOrderApi } from "../services/adminApi";
import Loader from "../components/shared/Loader";
import "./LiveOrders.css";

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const knownOrderIds = useRef(new Set());
  const audioRef = useRef(null);

  useEffect(() => {
    loadOrders(true);
    const interval = setInterval(() => loadOrders(false), 15000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = (isFirstLoad) => {
    fetchAllOrders()
      .then((data) => {
        if (!isFirstLoad) {
          const newOrder = data.find(
            (o) => !knownOrderIds.current.has(o.orderID)
          );
          if (newOrder && knownOrderIds.current.size > 0) {
            playAlertSound();
          }
        }
        data.forEach((o) => knownOrderIds.current.add(o.orderID));
        setOrders(data);
      })
      .catch(() => setError("Orders load nahi hue"))
      .finally(() => setLoading(false));
  };

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleCancel = async (orderID) => {
    const confirmed = window.confirm(`${orderID} cancel karna hai?`);
    if (!confirmed) return;

    try {
      await cancelOrderApi(orderID);
      loadOrders(false);
    } catch {
      alert("Order cancel nahi hua. Dobara try karo.");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Delivered") return "status-delivered";
    if (status === "Confirmed") return "status-confirmed";
    if (status === "Cancelled") return "status-cancelled";
    return "status-pending";
  };

  const getMinutesAgo = (timeStamp) => {
    if (!timeStamp) return null;
    const parts = timeStamp.split(",");
    if (parts.length < 2) return null;

    const datePart = parts[0].trim();
    const timePart = parts.slice(1).join(",").trim();

    const [day, month, year] = datePart.split("/").map(Number);
    const timeMatch = timePart.match(/(\d+):(\d+):(\d+)\s*(am|pm)/i);
    if (!timeMatch) return null;

    let [, hour, min, sec, ampm] = timeMatch;
    hour = Number(hour);
    min = Number(min);
    sec = Number(sec);
    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    const orderDate = new Date(year, month - 1, day, hour, min, sec);
    const now = new Date();
    const diffMs = now - orderDate;
    const diffMin = Math.floor(diffMs / 60000);

    return diffMin >= 0 ? diffMin : null;
  };

  if (loading) return <Loader />;
  if (error) return <p className="orders-error">{error}</p>;

  return (
    <div>
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="orders-header">
        <h2 className="orders-heading">📋 Live Orders</h2>
        <button className="orders-refresh-btn" onClick={() => loadOrders(false)}>
          🔄
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">Abhi koi order nahi hai</p>
      ) : (
        orders.map((order, i) => {
          const minutesAgo = getMinutesAgo(order.timeStamp);
          const isUrgent =
            minutesAgo !== null &&
            minutesAgo >= 15 &&
            order.orderStatus !== "Delivered" &&
            order.orderStatus !== "Cancelled";
          const isCancelled = order.orderStatus === "Cancelled";
          const isDelivered = order.orderStatus === "Delivered";

          return (
            <div
              key={i}
              className={`order-card ${isUrgent ? "order-urgent" : ""}`}
            >
              <div className="order-card-top">
                <span className="order-id">{order.orderID}</span>
                <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              {minutesAgo !== null && !isDelivered && !isCancelled && (
                <p className={`order-timer ${isUrgent ? "timer-urgent" : ""}`}>
                  ⏱️ {minutesAgo} min se pending
                </p>
              )}

              <div className="order-details">
                <p><strong>Table:</strong> {order.table}</p>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Mobile:</strong> {order.mobile}</p>
                <p><strong>Items:</strong> {order.items}</p>
                <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
                <p><strong>Time:</strong> {order.timeStamp}</p>
              </div>

              {!isDelivered && !isCancelled && (
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancel(order.orderID)}
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default LiveOrders;