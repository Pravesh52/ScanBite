import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import "./AdminLogin.css";

const ADMIN_PASSWORD = "scanbite123";

const AdminLogin = () => {
  const { setIsAdminLoggedIn } = useContext(AdminContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setError("");
    } else {
      setError("Galat password hai!");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h2 className="admin-login-heading">🔒 Admin Login</h2>
        <p className="admin-login-sub">ScanBite Admin Panel</p>
        {error && <p className="admin-login-error">{error}</p>}
        <input
          className="admin-login-input"
          type="password"
          placeholder="Password daalo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button className="admin-login-btn" onClick={handleLogin}>
          Login →
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;