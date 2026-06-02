const twilio = require("twilio");
const config = require("../config/config");

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

// OTP bhejo
const sendOTP = async (mobile) => {
  const verification = await client.verify.v2
    .services(config.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+91${mobile}`,
      channel: "sms",
    });
  return verification.status;
};

// OTP verify karo
const verifyOTP = async (mobile, otp) => {
  const result = await client.verify.v2
    .services(config.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${mobile}`,
      code: otp,
    });
  return result.status; // "approved" ya "pending"
};

module.exports = { sendOTP, verifyOTP };