import API from "./apiClient";

// Get product details
export const getProductById = (id: string) => {
  return API.get(`/products/${id}`);
};

// Get all categories
export const getCategories = () => {
  return API.get("/products/categories");
};

// Get products by category
export const getProductsByCategory = (categoryId: string) => {
  return API.get(`/products/category/${categoryId}`);
};
