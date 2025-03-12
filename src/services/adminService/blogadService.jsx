import axiosClient from "../api.config";

const API_URL = "/api/blogs";

const blogadService = {
  getBlogs: async () => {
    try {
      const response = await axiosClient.get(API_URL);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách bài viết:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  createBlog: async (blogData) => {
    try {
      const response = await axiosClient.post(API_URL, blogData);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi tạo bài viết:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  updateBlog: async (id, blogData) => {
    try {
      const response = await axiosClient.put(`${API_URL}/${id}`, blogData);
      return response.data;
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật bài viết:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  deleteBlog: async (id) => {
    try {
      await axiosClient.delete(`${API_URL}/${id}`);
      return { success: true, message: "Bài viết đã được xóa thành công" };
    } catch (error) {
      console.error(
        "Lỗi khi xóa bài viết:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default blogadService;
