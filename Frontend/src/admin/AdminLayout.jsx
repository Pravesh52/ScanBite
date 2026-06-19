import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: "/admin/dashboard", label: "🏠 Dashboard" },
    { path: "/admin/orders", label: "📋 Live Orders" },
    { path: "/admin/verify", label: "✅ Verify Order" },
    { path: "/admin/history", label: "📅 Order History" },
    { path: "/admin/inventory", label: "📦 Inventory" },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-logo">🍔 ScanBite Admin</div>
        <button
          className="admin-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      <nav className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`admin-nav-link ${
              location.pathname === link.path ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;