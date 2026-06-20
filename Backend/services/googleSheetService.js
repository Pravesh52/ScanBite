require("dotenv").config();
const { google } = require("googleapis");
// const key = require("C:/Users/HP/Downloads/woven-passkey-478214-h1-0bca671fa53d.json");
const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
// const SHEET_ID = "1eDbRB82aVU6iwBMBdtK-iBCtcLHNmfvKFZY0_dhQySs";

const getAuth = () => {
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

const getProducts = async () => {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
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

const checkInventory = async (productName) => {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
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

const updateInventory = async (productName, qtyOrdered) => {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Inventory!A2:F",
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row) => row[1] === productName);
  if (rowIndex === -1) return;
  const row = rows[rowIndex];
  const newSoldQty = Number(row[3]) + qtyOrdered;
  const newRemainingStock = Number(row[4]) - qtyOrdered;
  const newStatus = newRemainingStock <= 0 ? "Out of Stock" : "Available";
  const sheetRow = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Inventory!D${sheetRow}:F${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[newSoldQty, newRemainingStock, newStatus]],
    },
  });
};

module.exports = { getProducts, checkInventory, updateInventory };