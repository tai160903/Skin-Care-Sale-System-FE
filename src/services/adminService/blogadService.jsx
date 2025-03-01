import axios from "axios";

const API_URL = "http://localhost:8080/api/blogs";

// Hàm lấy danh sách tất cả blog
const getAllBlogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Hàm lấy blog theo ID
const getBlogById = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/${blogId}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data; // Trả về dữ liệu blog tìm được
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw error;
  }
};

// Hàm tạo một blog mới
const createBlog = async (blogData) => {
  try {
    const response = await axios.post(API_URL, blogData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Hàm cập nhật blog theo ID
const updateBlog = async (blogId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${blogId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Hàm xóa blog theo ID
const deleteBlog = async (blogId) => {
  try {
    await axios.delete(`${API_URL}/${blogId}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return { message: "Blog deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Xuất các hàm để sử dụng trong component
export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
