import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import MenuPageRoute from "./pages/MenuPageRoute";
import CartPageRoute from "./pages/CartPageRoute";
import OrderSuccessRoute from "./pages/OrderSuccessRoute";
import QRGenerator from "./pages/QRGenerator";
import AdminPanel from "./admin/AdminPanel";

const App = () => {
  return (
    <CartProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/menu" element={<MenuPageRoute />} />
            <Route path="/cart" element={<CartPageRoute />} />
            <Route path="/order-success" element={<OrderSuccessRoute />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </Router>
      </AdminProvider>
    </CartProvider>
  );
};

export default App;