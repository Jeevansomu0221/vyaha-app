import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

export const placeOrder = (token: string, partnerId: string, items: any[]) => {
  return API.post(
    "/orders",
    { partnerId, items },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getCustomerOrders = (token: string) => {
  return API.get("/orders/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getOrderById = (token: string, orderId: string) => {
  return API.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
