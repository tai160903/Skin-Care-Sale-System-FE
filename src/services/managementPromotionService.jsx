import axiosClient from "./api.config";

const managementPromotionService = {
  getAllPromotion: async () => {
    return await axiosClient.get("/api/promotionConditions");
  },
  createPromotion: async (data) => {
    return await axiosClient.post("/api/promotionConditions", data);
  },
  updatePromotion: async (id, data) => {
    return await axiosClient.put(`/api/promotionConditions/${id}`, data);
  },
  deletePromotion: async (id) => {
    return await axiosClient.delete(`/api/promotionConditions/${id}`);
  },
};

export default managementPromotionService;
