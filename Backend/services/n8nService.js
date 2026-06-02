const axios = require("axios");
const config = require("../config/config");

const sendOrderToN8n = async (orderData) => {
  const res = await axios.post(config.N8N_WEBHOOK_URL, orderData);
  return res.data;
};

module.exports = { sendOrderToN8n };