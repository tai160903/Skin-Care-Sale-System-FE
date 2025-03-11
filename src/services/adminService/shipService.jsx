// src/services/shipService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/shippings";

const shipService = {
  getAllShippings: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching shippings:", error);
      throw error;
    }
  },

  updateShippingStatus: async (id, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-status/${id}`,
        {
          shipping_status: status,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating shipping status:", error);
      throw error;
    }
  },
};

export default shipService;
