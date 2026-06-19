const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Products fetch failed");
  return res.json();
};

export const sendOtp = async (mobile) => {
  const res = await fetch(`${BASE_URL}/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  if (!res.ok) throw new Error("OTP nahi bheja");
  return res.json();
};

export const verifyOtp = async (mobile, otp) => {
  const res = await fetch(`${BASE_URL}/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp }),
  });
  if (!res.ok) throw new Error("OTP verify nahi hua");
  return res.json();
};

export const placeOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Order placement failed");
  return res.json();
};