import axiosClient from "../api.config";

const API_BASE_URL = "/api/users";

const allUserService = {
  getCustomers: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/customer`);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  getStaff: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/staff`);
      return response.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  },
};

export default allUserService;
