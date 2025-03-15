import axiosClient from "../api.config";

const API_BASE_URL = "/api/skintypes";

const skintypeService = {
  getSkinTypes: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching skin types:", error);
      throw error;
    }
  },
};
export default skintypeService;
