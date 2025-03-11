import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const userService = {
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_URL}/customer`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      return [];
    }
  },

  getStaffs: async () => {
    try {
      const response = await axios.get(`${API_URL}/staff`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      return [];
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    }
  },
};

export default userService;
