import axiosClient from "./api.config";

const cartService = {
  addToCart: (data) => axiosClient.post("/cart/add", data),

  applyPromotion: (data) => axiosClient.post("/cart/apply-promotion", data),

  removeItem: (customerId, productId) =>
    axiosClient.put(
      `/cart/remove-item?customerId=${customerId}&productId=${productId}`,
    ),

  clearCart: (customerId) =>
    axiosClient.delete(`/cart/clear?customerId=${customerId}`),
};

export default cartService;
