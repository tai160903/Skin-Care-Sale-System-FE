import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orders";

const orderService = {
  getAllOrders: async ({ page, limit }) =>
    axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`),

  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
        headers: { Accept: "application/json" },
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      console.log("status:", status);
      const response = await axios.put(
        `${API_BASE_URL}/${orderId}`,
        { order_status: status },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          "Error updating order status:",
          error.response.data.error,
        );
        throw error.response.data;
      }
      return Promise.reject(
        new Error("Lỗi không xác định khi cập nhật đơn hàng"),
      );
    }
  },
};

export default orderService;
