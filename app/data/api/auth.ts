import API from "./apiClient";

// Signup new user
export const signup = (phone: string, name: string) => {
  return API.post("/auth/signup", { phone, name });
};

// Login with phone + otp
export const login = (phone: string, otp: string) => {
  return API.post("/auth/login", { phone, otp });
};

// Request OTP (if you’re using SMS OTP)
export const requestOtp = (phone: string) => {
  return API.post("/auth/request-otp", { phone });
};
