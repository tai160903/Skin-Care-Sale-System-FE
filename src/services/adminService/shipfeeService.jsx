import axiosClient from "../api.config";

const API_URL = "/api/shipfees";

const shipFeeService = {
  getAllShipFees: async () => {
    try {
      const response = await axiosClient.get(API_URL);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách phí vận chuyển:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  createShipFee: async (shipFee) => {
    try {
      const response = await axiosClient.post(API_URL, shipFee);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi tạo phí vận chuyển:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  getShipFeeByLocation: async (location) => {
    try {
      const response = await axiosClient.get(`${API_URL}/location`, {
        params: { location },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy phí vận chuyển theo địa điểm:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  updateShipFee: async (id, shipFee) => {
    try {
      const response = await axiosClient.put(`${API_URL}/${id}`, shipFee);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật phí vận chuyển:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  deleteShipFee: async (id) => {
    try {
      const response = await axiosClient.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi xóa phí vận chuyển:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default shipFeeService;
