import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orders";

const orderService = {
  getAllOrders: ({ page, limit }) =>
    axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`),

  // getOrdersByStatus: async (status, page = 1, limit = 10) => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/status/`, {
  //       params: { status, page, limit },
  //       headers: { Accept: "application/json" },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error fetching orders with status ${status}:`, error);
  //     throw error;
  //   }
  // },

  updateOrderStatus: async (orderId, status) => {
    try {
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
      console.error(`Error updating order status for ID ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderService;
