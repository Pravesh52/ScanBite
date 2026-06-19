import React, { useEffect, useState } from "react";
import { fetchInventory, updateInventoryItem } from "../services/adminApi";
import Loader from "../components/shared/Loader";
import "./Inventory.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editStock, setEditStock] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setLoading(true);
    fetchInventory()
      .then((data) => setItems(data))
      .catch(() => setError("Inventory load nahi hui"))
      .finally(() => setLoading(false));
  };

  const handleEdit = (item) => {
    setEditingRow(item.rowNumber);
    setEditStock(item.totalStock);
  };

  const handleSave = async (item) => {
    const newTotal = Number(editStock);
    const newRemaining = newTotal - Number(item.soldQty);
    const newStatus = newRemaining <= 0 ? "Out of Stock" : "Available";

    try {
      await updateInventoryItem({
        rowNumber: item.rowNumber,
        totalStock: newTotal,
        remainingStock: newRemaining,
        status: newStatus,
      });
      setEditingRow(null);
      loadInventory();
    } catch {
      setError("Update nahi hua");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="inventory-error">{error}</p>;

  return (
    <div>
      <h2 className="inventory-heading">📦 Inventory</h2>

      {items.map((item) => (
        <div key={item.rowNumber} className="inventory-card">
          <div className="inventory-card-top">
            <span className="inventory-name">{item.productName}</span>
            <span
              className={`inventory-status ${
                item.status === "Available" ? "available" : "out"
              }`}
            >
              {item.status}
            </span>
          </div>

          {editingRow === item.rowNumber ? (
            <div className="inventory-edit-row">
              <input
                className="inventory-edit-input"
                type="number"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
              />
              <button
                className="inventory-save-btn"
                onClick={() => handleSave(item)}
              >
                Save ✅
              </button>
              <button
                className="inventory-cancel-btn"
                onClick={() => setEditingRow(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="inventory-stats">
              <p>Total: <strong>{item.totalStock}</strong></p>
              <p>Sold: <strong>{item.soldQty}</strong></p>
              <p>Remaining: <strong>{item.remainingStock}</strong></p>
              <button
                className="inventory-edit-btn"
                onClick={() => handleEdit(item)}
              >
                ✏️ Edit Stock
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Inventory;