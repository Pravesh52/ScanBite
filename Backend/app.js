const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/products", productRoutes);
app.use("/order", orderRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;