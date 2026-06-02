// OTP Send
export const sendOtp = async (mobile) => {
  const res = await fetch(`${BASE_URL}/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  if (!res.ok) throw new Error("OTP nahi bheja");
  return res.json();
};

// OTP Verify
export const verifyOtp = async (mobile, otp) => {
  const res = await fetch(`${BASE_URL}/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp }),
  });
  if (!res.ok) throw new Error("OTP verify nahi hua");
  return res.json();
};