import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users";

const allUserService = {
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  getStaff: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  },
};

export default allUserService;
