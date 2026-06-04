import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import MenuPageRoute from "./pages/MenuPageRoute";
import CartPageRoute from "./pages/CartPageRoute";
import OrderSuccessRoute from "./pages/OrderSuccessRoute";

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/menu" element={<MenuPageRoute />} />
          <Route path="/cart" element={<CartPageRoute />} />
          <Route path="/order-success" element={<OrderSuccessRoute />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;