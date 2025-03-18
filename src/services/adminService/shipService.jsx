import axiosClient from "../api.config";

const API_BASE_URL = "/api/shippings";

const shipService = {
  getAllShippings: async ({ page, limit }) => {
    try {
      const response = await axiosClient.get(
        `${API_BASE_URL}?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching shippings:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  updateShippingStatus: async (id, reason) => {
    try {
      const response = await axiosClient.put(
        `${API_BASE_URL}/update-reason/${id}`,
        {
          reason: reason,
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating shipping status:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default shipService;
