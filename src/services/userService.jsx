import axiosClient from "./api.config";

const API_URL = "/api/users";

const userService = {
  getCustomers: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/customer`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách khách hàng:",
        error.response?.data || error.message,
      );
      return [];
    }
  },

  getStaffs: async () => {
    try {
      const response = await axiosClient.get(`${API_URL}/staff`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách nhân viên:",
        error.response?.data || error.message,
      );
      return [];
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axiosClient.put(
        `${API_URL}/update/${id}`,
        userData,
      );
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật người dùng:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axiosClient.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi xóa người dùng:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default userService;
