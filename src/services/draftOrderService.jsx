import axiosClient from "./api.config";

const draftOrderService = {
  applyPromotion: async (data) => {
    try {
      return await axiosClient.post("/api/cart/apply-promotion", data);
    } catch (error) {
      console.error("Error applying promotion:", error);
      throw error;
    }
  },

  getShippingFee: async (data) => {
    try {
      return await axiosClient.post("/api/shippingFee/location", data);
    } catch (error) {
      console.error("Error getting shipping fee:", error);
      throw error;
    }
  },

  createOrder: async (data) => {
    return await axiosClient.post(`/api/Orders/create`, data);
  },

  deleteOrder: async (id) => {
    return await axiosClient.delete(`/api/Orders/${id}`);
  },
};

export default draftOrderService;
