const { google } = require("googleapis");
const key = require("C:/Users/HP/Downloads/woven-passkey-478214-h1-0bca671fa53d.json");

const SHEET_ID = "1eDbRB82aVU6iwBMBdtK-iBCtcLHNmfvKFZY0_dhQySs";

const getAuth = () => {
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

// 🔥 1. Sab Orders Lao (Live Orders)
const getAllOrders = async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth: getAuth() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Orders!A2:N",
    });

    const rows = response.data.values || [];

    const orders = rows.map((row) => ({
      orderID: row[0] || "",
      name: row[1] || "",
      mobile: row[2] || "",
      email: row[3] || "",
      table: row[4] || "",
      items: row[5] || "",
      totalAmount: row[6] || "",
      paymentMethod: row[7] || "",
      paymentStatus: row[8] || "",
      orderStatus: row[9] || "",
      timeStamp: row[10] || "",
      verifyCode: row[11] || "",
      verifiedAt: row[12] || "",
      deliveredAt: row[13] || "",
    }));

    // Sabse naya order pehle dikhe
    orders.reverse();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);
    res.status(500).json({ message: "Orders load nahi hue" });
  }
};

// 🔥 2. Order History — Date Wise Filter
// const getOrderHistory = async (req, res) => {
//   try {
//     const { date } = req.query; // Example: 2026-06-04

//     const sheets = google.sheets({ version: "v4", auth: getAuth() });
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID,
//       range: "Orders!A2:N",
//     });

//     const rows = response.data.values || [];

//     let orders = rows.map((row) => ({
//       orderID: row[0] || "",
//       name: row[1] || "",
//       mobile: row[2] || "",
//       email: row[3] || "",
//       table: row[4] || "",
//       items: row[5] || "",
//       totalAmount: row[6] || "",
//       paymentMethod: row[7] || "",
//       paymentStatus: row[8] || "",
//       orderStatus: row[9] || "",
//       timeStamp: row[10] || "",
//       verifyCode: row[11] || "",
//       verifiedAt: row[12] || "",
//       deliveredAt: row[13] || "",
//     }));

//     // Agar date diya hai toh filter karo
//     if (date) {
//       orders = orders.filter((order) => {
//         if (!order.timeStamp) return false;
//         const orderDate = new Date(order.timeStamp);
//         const filterDate = new Date(date);
//         return (
//           orderDate.getDate() === filterDate.getDate() &&
//           orderDate.getMonth() === filterDate.getMonth() &&
//           orderDate.getFullYear() === filterDate.getFullYear()
//         );
//       });
//     }

//     orders.reverse();
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Order history error:", error.message);
//     res.status(500).json({ message: "History load nahi hui" });
//   }
// };

const getOrderHistory = async (req, res) => {
  try {
    const { date } = req.query; // Example: 2026-06-19

    const sheets = google.sheets({ version: "v4", auth: getAuth() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Orders!A2:N",
    });

    const rows = response.data.values || [];

    let orders = rows.map((row) => ({
      orderID: row[0] || "",
      name: row[1] || "",
      mobile: row[2] || "",
      email: row[3] || "",
      table: row[4] || "",
      items: row[5] || "",
      totalAmount: row[6] || "",
      paymentMethod: row[7] || "",
      paymentStatus: row[8] || "",
      orderStatus: row[9] || "",
      timeStamp: row[10] || "",
    //   verifyCode: row[11] || "",
      verifiedAt: row[12] || "",
      deliveredAt: row[13] || "",
    }));

    if (date) {
      // date input format: YYYY-MM-DD
      const [filterYear, filterMonth, filterDay] = date.split("-").map(Number);

      orders = orders.filter((order) => {
        if (!order.timeStamp) return false;

        // timeStamp format: "19/6/2026, 2:30:00 pm" (en-IN locale)
        const datePart = order.timeStamp.split(",")[0].trim(); // "19/6/2026"
        const [day, month, year] = datePart.split("/").map(Number);

        return (
          day === filterDay &&
          month === filterMonth &&
          year === filterYear
        );
      });
    }

    orders.reverse();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Order history error:", error.message);
    res.status(500).json({ message: "History load nahi hui" });
  }
};

// 🔥 3. Inventory Lao
const getInventoryAdmin = async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth: getAuth() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Inventory!A2:F",
    });

    const rows = response.data.values || [];

    const inventory = rows.map((row, index) => ({
      rowNumber: index + 2,
      productID: row[0] || "",
      productName: row[1] || "",
      totalStock: row[2] || "",
      soldQty: row[3] || "",
      remainingStock: row[4] || "",
      status: row[5] || "",
    }));

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Inventory error:", error.message);
    res.status(500).json({ message: "Inventory load nahi hui" });
  }
};

// 🔥 4. Inventory Update Karo
const updateInventoryAdmin = async (req, res) => {
  try {
    const { rowNumber, totalStock, remainingStock, status } = req.body;

    if (!rowNumber) {
      return res.status(400).json({ message: "Row number zaroori hai" });
    }

    const sheets = google.sheets({ version: "v4", auth: getAuth() });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Inventory!C${rowNumber}:F${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[totalStock, 0, remainingStock, status]],
      },
    });

    res.status(200).json({ message: "Inventory update ho gaya! ✅" });
  } catch (error) {
    console.error("Update inventory error:", error.message);
    res.status(500).json({ message: "Inventory update nahi hui" });
  }
};

// 🔥 5. Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth: getAuth() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Orders!A2:N",
    });

    const rows = response.data.values || [];

    // Today's date in IST, as day/month/year
    const todayIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const todayDatePart = todayIST.split(",")[0].trim(); // "19/6/2026"
    const [todayDay, todayMonth, todayYear] = todayDatePart.split("/").map(Number);

    let todayRevenue = 0;
    let todayOrders = 0;
    let totalRevenue = 0;
    let totalOrders = rows.length;
    let pendingOrders = 0;
    const itemCount = {};

    rows.forEach((row) => {
      const amount = Number(row[6]) || 0;
      const orderStatus = row[9] || "";
      const timeStamp = row[10] || "";
      const items = row[5] || "";

      totalRevenue += amount;

      if (orderStatus !== "Delivered") {
        pendingOrders++;
      }

      // Check if this row's date matches today
      if (timeStamp) {
        const datePart = timeStamp.split(",")[0].trim(); // "19/6/2026"
        const parts = datePart.split("/").map(Number);

        if (parts.length === 3) {
          const [day, month, year] = parts;
          if (day === todayDay && month === todayMonth && year === todayYear) {
            todayRevenue += amount;
            todayOrders++;
          }
        }
      }

      if (items) {
        items.split(",").forEach((item) => {
          const itemName = item.trim().split(" x")[0];
          if (itemName) {
            itemCount[itemName] = (itemCount[itemName] || 0) + 1;
          }
        });
      }
    });

    const popularItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({
      todayRevenue,
      todayOrders,
      totalRevenue,
      totalOrders,
      pendingOrders,
      popularItems,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ message: "Stats load nahi hue" });
  }
};

// 🔥 6. Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ message: "Order ID zaroori hai" });
    }

    const sheets = google.sheets({ version: "v4", auth: getAuth() });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Orders!A2:N",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === orderID);

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    const sheetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Orders!J${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Cancelled"]],
      },
    });

    res.status(200).json({ message: "Order cancel ho gaya! ✅" });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    res.status(500).json({ message: "Order cancel nahi hua" });
  }
};

module.exports = {
  getAllOrders,
  getOrderHistory,
  getInventoryAdmin,
  updateInventoryAdmin,
  getDashboardStats,
  cancelOrder,
};