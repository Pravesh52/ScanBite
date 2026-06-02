const Razorpay = require("razorpay");
const config = require("../config/config");

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (amount) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // paise me convert
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
  return order;
};

module.exports = { createPaymentOrder };