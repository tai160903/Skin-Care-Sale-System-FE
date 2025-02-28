import axios from 'axios';

const API_URL = 'http://localhost:8080/api/blogs';

const getBlogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export { getBlogs };