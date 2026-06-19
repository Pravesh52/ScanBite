import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/adminApi";
import Loader from "../components/shared/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setLoading(true);
    fetchDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError("Stats load nahi hue"))
      .finally(() => setLoading(false));
  };

  if (loading) return <Loader />;
  if (error) return <p className="dashboard-error">{error}</p>;

  return (
    <div>
      <h2 className="dashboard-heading">📊 Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="dashboard-card-label">Today Income</p>
          <p className="dashboard-card-value">₹{stats.todayRevenue}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-label">Today Orders</p>
          <p className="dashboard-card-value">{stats.todayOrders}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-label">Total Revenue</p>
          <p className="dashboard-card-value">₹{stats.totalRevenue}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-card-label">Total Orders</p>
          <p className="dashboard-card-value">{stats.totalOrders}</p>
        </div>
        <div className="dashboard-card pending">
          <p className="dashboard-card-label">Pending Orders</p>
          <p className="dashboard-card-value">{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="popular-items">
        <h3 className="popular-heading">🔥 Popular Items</h3>
        {stats.popularItems.length === 0 ? (
          <p className="no-data">Just not finding a data</p>
        ) : (
          stats.popularItems.map((item, i) => (
            <div key={i} className="popular-item-row">
              <span>{i + 1}. {item.name}</span>
              <span className="popular-count">{item.count} orders</span>
            </div>
          ))
        )}
      </div>

      <button className="refresh-btn" onClick={loadStats}>
        🔄 Refresh
      </button>
    </div>
  );
};

export default Dashboard;