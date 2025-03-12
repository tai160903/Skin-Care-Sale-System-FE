import axiosClient from "./api.config";

const API_URL = "/api/blogs";

const getBlogs = async () => {
  try {
    const response = await axiosClient.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching blogs:",
      error.response?.data || error.message,
    );
    return [];
  }
};

export { getBlogs };
