import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import LiveOrders from "./LiveOrders";
import VerifyOrder from "./VerifyOrder";
import OrderHistory from "./OrderHistory";
import Inventory from "./Inventory";

const AdminPanel = () => {
  const { isAdminLoggedIn } = useContext(AdminContext);

  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<LiveOrders />} />
        <Route path="verify" element={<VerifyOrder />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;