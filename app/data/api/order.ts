import API from "./apiClient";

// Place a new order
export const placeOrder = (token: string, partnerId: string, items: any[]) => {
  return API.post(
    "/orders",
    { partnerId, items },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Get all orders of logged-in customer
export const getCustomerOrders = (token: string) => {
  return API.get("/orders/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get order details by ID
export const getOrderById = (token: string, orderId: string) => {
  return API.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
