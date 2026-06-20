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

const verifyOrder = async (req, res) => {
  try {
    const { verifyCode } = req.body;

    if (!verifyCode) {
      return res.status(400).json({ message: "Verify code zaroori hai" });
    }

    const sheets = google.sheets({ version: "v4", auth: getAuth() });

    // Orders sheet se data lao
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Orders!A2:N",
    });

    const rows = response.data.values || [];

    // verifyCode wali row dhundho
    // Column index: A=0,B=1,C=2,D=3,E=4,F=5,G=6,H=7,I=8,J=9,K=10,L=11,M=12,N=13
    const rowIndex = rows.findIndex((row) => row[11] === verifyCode);

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Galat verify code hai" });
    }

    const row = rows[rowIndex];
    const orderStatus = row[9];

    // Already delivered check karo
    if (orderStatus === "Delivered") {
      return res.status(400).json({ message: "Ye order pehle se deliver ho chuka hai" });
    }

    // Timestamp banao
    const now = new Date();
    const timestamp = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Sheet row number (2 se start hoti hai)
    const sheetRow = rowIndex + 2;

    // Update karo — paymentStatus, orderStatus, verifiedAt, deliveredAt
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Orders!I${sheetRow}:N${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["Paid", "Delivered", timestamp, timestamp]],
      },
    });

    return res.status(200).json({
      message: "Order verify ho gaya! ✅",
      orderID: row[0],
      name: row[1],
      table: row[4],
      items: row[5],
      totalAmount: row[6],
    });

  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verify nahi hua", error: error.message });
  }
};

module.exports = { verifyOrder };