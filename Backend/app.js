const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const otpRoutes = require("./routes/otpRoutes");
const verifyOrderRoutes = require("./routes/verifyOrderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: ["https://scan-bite-ten.vercel.app", "http://localhost:3000"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRoutes);
app.use("/order", orderRoutes);
app.use("/otp", otpRoutes);
app.use("/verify-order", verifyOrderRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;