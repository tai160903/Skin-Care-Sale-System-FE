import axiosClient from "./api.config";

const cartService = {
  getCart: (customerId) => {
    return axiosClient.get(`/api/cart/${customerId}`);
  },

  addToCart: (data) => {
    return axiosClient.post("/api/cart/add", data);
  },

  applyPromotion: (data) => axiosClient.post("/api/cart/apply-promotion", data),

  removeItem: (customerId, productId) =>
    axiosClient.put(
      `/api/cart/remove-item?customerId=${customerId}&productId=${productId}`,
    ),

  clearCart: (customerId) =>
    axiosClient.delete(`/api/cart/clear?customerId=${customerId}`),
};

export default cartService;
