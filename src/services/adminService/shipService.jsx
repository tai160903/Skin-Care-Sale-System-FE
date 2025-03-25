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
  updateStatus: async (id, status) => {
    try {
      console.log("check:", id, status);
      const response = await axiosClient.put(
        `${API_BASE_URL}/update-status/${id}`,
        {
          shipping_status: status,
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
  getShippingByOrderId: async (orderId) => {
    try {
      const response = await axiosClient.get(
        `${API_BASE_URL}?order_id=${orderId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching shipping by order ID:",
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
