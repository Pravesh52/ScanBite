const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderHistory,
  getInventoryAdmin,
  updateInventoryAdmin,
  getDashboardStats,
  cancelOrder,
} = require("../controllers/adminController");

router.get("/orders", getAllOrders);
router.get("/orders/history", getOrderHistory);
router.get("/inventory", getInventoryAdmin);
router.put("/inventory", updateInventoryAdmin);
router.get("/dashboard-stats", getDashboardStats);
router.put("/cancel-order", cancelOrder);

module.exports = router;