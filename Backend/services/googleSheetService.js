const { google } = require("googleapis");
const config = require("../config/config");

const auth = new google.auth.JWT(
  config.GOOGLE_CLIENT_EMAIL,
  null,
  config.GOOGLE_PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

// Products Sheet se data lao
const getProducts = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: "Products!A2:F",
  });

  const rows = res.data.values || [];
  return rows.map((row) => ({
    id: row[0],
    name: row[1],
    price: Number(row[2]),
    image: row[3],
    category: row[4],
    available: row[5] === "TRUE",
  }));
};

// Inventory check karo
const checkInventory = async (productName) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: "Inventory!A2:F",
  });

  const rows = res.data.values || [];
  const item = rows.find((row) => row[1] === productName);
  if (!item) return null;

  return {
    productID: item[0],
    productName: item[1],
    totalStock: Number(item[2]),
    soldQty: Number(item[3]),
    remainingStock: Number(item[4]),
    status: item[5],
  };
};

// Inventory update karo — order ke baad
const updateInventory = async (productName, qtyOrdered) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: "Inventory!A2:F",
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row) => row[1] === productName);
  if (rowIndex === -1) return;

  const row = rows[rowIndex];
  const newSoldQty = Number(row[3]) + qtyOrdered;
  const newRemainingStock = Number(row[4]) - qtyOrdered;
  const newStatus = newRemainingStock <= 0 ? "Out of Stock" : "Available";

  // Row 2 se start hoti hai isliye +2
  const sheetRow = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `Inventory!D${sheetRow}:F${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[newSoldQty, newRemainingStock, newStatus]],
    },
  });
};

module.exports = { getProducts, checkInventory, updateInventory };