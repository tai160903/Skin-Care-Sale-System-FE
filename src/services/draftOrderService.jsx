import axiosClient from "./api.config";

const draftOrderService = {
  applyPromotion: (data) => axiosClient.post("/api/cart/apply-promotion", data),

  getShippingFee: (data) => axiosClient.post("/api/shippingFee/location", data),

  createOrder: (data) => axiosClient.post(`/api/Orders/create`, data),
};
export default draftOrderService;
