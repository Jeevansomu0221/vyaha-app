import API from "./apiClient";

// Get menu (food items & categories)
export const getMenu = () => {
  return API.get("/customer/menu");
};

// Get logged-in customer profile
export const getProfile = (token: string) => {
  return API.get("/customer/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update profile
export const updateProfile = (token: string, data: any) => {
  return API.put("/customer/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
