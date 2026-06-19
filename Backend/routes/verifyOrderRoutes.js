const express = require("express");
const router = express.Router();
const { verifyOrder } = require("../controllers/verifyOrderController");

router.post("/", verifyOrder);

module.exports = router;