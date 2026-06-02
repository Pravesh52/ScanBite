const { checkInventory, updateInventory } = require("../services/googleSheetService");
const { sendOrderToN8n } = require("../services/n8nService");
const { createPaymentOrder } = require("../services/razorpayService");

const placeOrder = async (req, res) => {
  try {
    const { name, mobile, email, table, items, totalAmount, paymentMethod } = req.body;

    // Step 1 — Inventory check karo
    for (const item of items) {
      const inventory = await checkInventory(item.name);

      if (!inventory) {
        return res.status(400).json({ message: `${item.name} inventory me nahi mila` });
      }

      if (inventory.remainingStock < item.qty) {
        return res.status(400).json({
          message: `${item.name} Out of Stock hai — sirf ${inventory.remainingStock} bacha hai`,
        });
      }
    }

    // Step 2 — Order ID banao
    const orderID = `ORD${Date.now()}`;

    // Step 3 — Order data banao
    const orderData = {
      orderID,
      name,
      mobile,
      email,
      table,
      items,
      totalAmount,
      paymentMethod,
    };

    // Step 4 — Razorpay order banao agar online payment ho
    let razorpayOrder = null;
    if (paymentMethod === "Online") {
      razorpayOrder = await createPaymentOrder(totalAmount);
      orderData.razorpayOrderId = razorpayOrder.id;
    }

    // Step 5 — n8n ko bhejo
    await sendOrderToN8n(orderData);

    // Step 6 — Inventory update karo
    for (const item of items) {
      await updateInventory(item.name, item.qty);
    }

    // Step 7 — Response bhejo
    res.status(200).json({
      message: "Order place ho gaya!",
      orderID,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ message: "Order place nahi hua" });
  }
};

module.exports = { placeOrder };