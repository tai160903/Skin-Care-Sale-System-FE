import axiosClient from "./api.config";

const profileService = {
  getProfile: async (customerId) => {
    return await axiosClient.get(`/api/users/customer/${customerId}`);
  },

  getPromotionsByCustomerId: async (customerId) => {
    return await axiosClient.get(`/api/promotions/customer/${customerId}`);
  },

  redeemPoints: async (data) => {
    console.log(data);
    return await axiosClient.post(`/api/promotions/customer`, data);
  },
};

export default profileService;
