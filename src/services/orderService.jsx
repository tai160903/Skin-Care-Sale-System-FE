import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orders";

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${orderId}`,
        {
          order_status: status,
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
      console.error(`Error updating order status for ID ${orderId}:`, error);
      throw error;
    }
  },

  getOrdersByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customer/${customerId}`,
        {
          headers: { Accept: "application/json" },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching orders for customer ID ${customerId}:`,
        error,
      );
      throw error;
    }
  },

  getOrdersByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/`, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  },

  getOrdersByCustomerAndStatus: async (customerId, status) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customer-status/${customerId}/${encodeURIComponent(status)}`,
        {
          headers: { Accept: "application/json" },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching orders for customer ${customerId} with status ${status}:`,
        error,
      );
      throw error;
    }
  },
};

export default orderService;
