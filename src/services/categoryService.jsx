import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products/category/';

const CategoryService = {
  getProductsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category products:', error);
      return [];
    }
  },
};

export default CategoryService;