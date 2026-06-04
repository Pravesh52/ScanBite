const { google } = require("googleapis");
const json = require('C:/Users/HP/Downloads/woven-passkey-478214-h1-0bca671fa53d.json');

const auth = new google.auth.JWT(
  json.client_email,
  null,
  json.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

async function test() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1eDbRB82aVU6iwBMBdtK-iBCtcLHNmfvKFZY0_dhQySs",
      range: "Products!A2:F",
    });
    console.log("✅ Connected! Data:", res.data.values);
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

test();