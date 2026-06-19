import React, { useEffect, useState } from "react";
import { fetchAllOrders, verifyOrderCode } from "../services/adminApi";
import Loader from "../components/shared/Loader";
import "./VerifyOrder.css";

const VerifyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [codeInputs, setCodeInputs] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 15000); // 15 sec auto refresh
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    fetchAllOrders()
      .then((data) => {
        // Sirf jo abhi tak Delivered nahi hain wo dikhao
        const pending = data.filter((o) => o.orderStatus !== "Delivered");
        setOrders(pending);
      })
      .catch(() => setError("Orders load nahi hue"))
      .finally(() => setLoading(false));
  };

  const handleCodeChange = (orderID, value) => {
    setCodeInputs((prev) => ({ ...prev, [orderID]: value }));
    setRowErrors((prev) => ({ ...prev, [orderID]: "" }));
  };

  const handleVerify = async (order) => {
    const enteredCode = codeInputs[order.orderID] || "";

    if (enteredCode.length !== 4) {
      setRowErrors((prev) => ({ ...prev, [order.orderID]: "4 digit code daalo" }));
      return;
    }

    setVerifyingId(order.orderID);
    try {
      const res = await verifyOrderCode(enteredCode);
      if (res.message.includes("✅")) {
        loadOrders(); // List refresh karo
        setCodeInputs((prev) => ({ ...prev, [order.orderID]: "" }));
      } else {
        setRowErrors((prev) => ({ ...prev, [order.orderID]: res.message }));
      }
    } catch {
      setRowErrors((prev) => ({ ...prev, [order.orderID]: "Verify nahi hua" }));
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="verify-error-page">{error}</p>;

  return (
    <div>
      <h2 className="verify-heading">✅ Verify Order</h2>
      <p className="verify-sub">Customer ke pass jao, table dekho, code lo aur verify karo</p>

      {orders.length === 0 ? (
        <p className="no-pending">🎉 Sab orders verify ho gaye hain!</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderID} className="verify-order-card">
            <div className="verify-card-top">
              <span className="verify-order-id">{order.orderID}</span>
              <span
                className={`verify-order-status ${
                  order.orderStatus === "Confirmed" ? "confirmed" : "pending"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="verify-card-details">
              <p className="verify-table-highlight">🪑 Table: {order.table}</p>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Items:</strong> {order.items}</p>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
              <p><strong>Time:</strong> {order.timeStamp}</p>
            </div>

            {rowErrors[order.orderID] && (
              <p className="verify-row-error">{rowErrors[order.orderID]}</p>
            )}

            <div className="verify-card-action">
              <input
                className="verify-card-input"
                type="number"
                placeholder="4 digit code"
                value={codeInputs[order.orderID] || ""}
                onChange={(e) => handleCodeChange(order.orderID, e.target.value)}
                maxLength={4}
              />
              <button
                className="verify-card-btn"
                onClick={() => handleVerify(order)}
                disabled={verifyingId === order.orderID}
              >
                {verifyingId === order.orderID ? "Verify ho raha hai..." : "Verify ✅"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VerifyOrder;