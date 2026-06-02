const { sendOTP, verifyOTP } = require("../services/otpService");

// OTP Send
const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number zaroori hai" });
    }

    if (mobile.length !== 10) {
      return res.status(400).json({ message: "Mobile number 10 digit ka hona chahiye" });
    }

    const status = await sendOTP(mobile);

    res.status(200).json({
      message: "OTP bhej diya gaya!",
      status,
    });
  } catch (error) {
    console.error("OTP send error:", error.message);
    res.status(500).json({ message: "OTP nahi bheja ja saka" });
  }
};

// OTP Verify
const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile aur OTP zaroori hai" });
    }

    const status = await verifyOTP(mobile, otp);

    if (status === "approved") {
      return res.status(200).json({
        message: "Mobile verify ho gaya!",
        verified: true,
      });
    } else {
      return res.status(400).json({
        message: "Galat OTP hai",
        verified: false,
      });
    }
  } catch (error) {
    console.error("OTP verify error:", error.message);
    res.status(500).json({ message: "OTP verify nahi ho saka" });
  }
};

module.exports = { sendOtp, verifyOtp };