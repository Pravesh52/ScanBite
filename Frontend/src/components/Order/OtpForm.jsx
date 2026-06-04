import React, { useState } from "react";
import useCart from "../../hooks/useCart";
import { sendOtp, verifyOtp } from "../../services/api";
import "./OtpForm.css";

const OtpForm = () => {
  const { setCustomerMobile, setIsVerified } = useCart();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("10 digit mobile number daalo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(mobile);
      setOtpSent(true);
      setSuccess("OTP bhej diya gaya! ✅");
    } catch {
      setError("OTP nahi bheja ja saka. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("6 digit OTP daalo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(mobile, otp);
      if (res.verified) {
        setCustomerMobile(mobile);
        setIsVerified(true);
      } else {
        setError("Galat OTP hai. Dobara try karo.");
      }
    } catch {
      setError("OTP verify nahi hua. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h3 className="otp-heading">Mobile Verify Karo 📱</h3>
      {error && <p className="otp-error">{error}</p>}
      {success && <p className="otp-success">{success}</p>}

      {!otpSent ? (
        <>
          <input
            className="otp-input"
            type="number"
            placeholder="Mobile Number (10 digit)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            maxLength={10}
          />
          <button
            className="otp-btn"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Bhej raha hai..." : "OTP Bhejo 📩"}
          </button>
        </>
      ) : (
        <>
          <p className="otp-info">+91 {mobile} pe OTP bheja gaya</p>
          <input
            className="otp-input"
            type="number"
            placeholder="6 digit OTP daalo"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button
            className="otp-btn"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Verify ho raha hai..." : "Verify Karo ✅"}
          </button>
          <button
            className="otp-resend"
            onClick={() => { setOtpSent(false); setSuccess(""); }}
          >
            Number Change Karo
          </button>
        </>
      )}
    </div>
  );
};

export default OtpForm;