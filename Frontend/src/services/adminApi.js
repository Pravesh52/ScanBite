const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchAllOrders = async () => {
  const res = await fetch(`${BASE_URL}/admin/orders`);
  if (!res.ok) throw new Error("Orders fetch failed");
  return res.json();
};

export const fetchOrderHistory = async (date) => {
  const url = date
    ? `${BASE_URL}/admin/orders/history?date=${date}`
    : `${BASE_URL}/admin/orders/history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("History fetch failed");
  return res.json();
};

export const fetchInventory = async () => {
  const res = await fetch(`${BASE_URL}/admin/inventory`);
  if (!res.ok) throw new Error("Inventory fetch failed");
  return res.json();
};

export const updateInventoryItem = async (data) => {
  const res = await fetch(`${BASE_URL}/admin/inventory`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Inventory update failed");
  return res.json();
};

export const fetchDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/dashboard-stats`);
  if (!res.ok) throw new Error("Stats fetch failed");
  return res.json();
};

export const verifyOrderCode = async (verifyCode) => {
  const res = await fetch(`${BASE_URL}/verify-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verifyCode }),
  });
  return res.json();
};

export const cancelOrderApi = async (orderID) => {
  const res = await fetch(`${BASE_URL}/admin/cancel-order`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderID }),
  });
  if (!res.ok) throw new Error("Cancel failed");
  return res.json();
};