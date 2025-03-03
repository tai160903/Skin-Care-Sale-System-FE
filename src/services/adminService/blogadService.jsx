import axios from "axios";

const API_URL = "http://localhost:8080/api/blogs"; // Thay bằng URL API thực tế

const blogadService = {
  getBlogs: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài viết:", error.response?.data || error.message);
      throw error;
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await axios.post(API_URL, blogData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
      throw error;
    }
  },

  updateBlog: async (id, blogData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, blogData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteBlog: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { success: true, message: "Bài viết đã được xóa thành công" };
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default blogadService;
