import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./QRGenerator.css";

const OWNER_PASSWORD = "scanbite123";
const BASE_URL = "https://scan-bite-ten.vercel.app";


const QRGenerator = () => {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === OWNER_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Galat password hai!");
    }
  };

  const handleGenerate = () => {
    if (!tableNumber) {
      setError("Enter the Table Number");
      return;
    }
    setGenerated(true);
    setError("");
  };

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Table-${tableNumber}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const qrUrl = `${BASE_URL}/menu?table=${tableNumber}`;

  // Password Screen
  if (!isLoggedIn) {
    return (
      <div className="qr-login">
        <div className="qr-login-box">
          <h2 className="qr-login-heading">🔒 Owner Login</h2>
          <p className="qr-login-sub">ScanBite QR Generator</p>
          {error && <p className="qr-error">{error}</p>}
          <input
            className="qr-input"
            type="password"
            placeholder="Password "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className="qr-btn" onClick={handleLogin}>
            Login →
          </button>
        </div>
      </div>
    );
  }

  // QR Generator Screen
  return (
    <div className="qr-container">
      <h2 className="qr-heading">🍔 ScanBite QR Generator</h2>
      <p className="qr-sub">Generat a Table QR code</p>

      {error && <p className="qr-error">{error}</p>}

      <div className="qr-form">
        <input
          className="qr-input"
          type="number"
          placeholder="Fill the Table number (1, 2, 3...)"
          value={tableNumber}
          onChange={(e) => {
            setTableNumber(e.target.value);
            setGenerated(false);
          }}
        />
        <button className="qr-btn" onClick={handleGenerate}>
          Generate QR Code
        </button>
      </div>

      {generated && (
        <div className="qr-result">
          <p className="qr-table-label"> QR Code of Table {tableNumber}</p>
          <div className="qr-code-box">
           <QRCodeSVG
                    id="qr-code"
                    value={qrUrl}
                    size={220}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    />

          </div>
          <p className="qr-url">{qrUrl}</p>
          <button className="qr-download-btn" onClick={handleDownload}>
            ⬇️ Download PNG
          </button>
          <button
            className="qr-new-btn"
            onClick={() => {
              setTableNumber("");
              setGenerated(false);
            }}
          >
            Generate new QR
          </button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;