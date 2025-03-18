import axiosClient from "./api.config";

const productService = {
  getAllProduct: ({ page, limit, category = "" }) =>
    axiosClient.get(
      `/api/products?page=${page}&limit=${limit}&category=${category}`,
    ),

  getAllCategory: () => axiosClient.get(`/api/categories`),

  getCategories: () => axiosClient.get("/api/categories"),

  getProductById: (id) => axiosClient.get(`/api/products/${id}`),

  createProduct: (data) => axiosClient.post("/api/products", data),

  updateProduct: (id, data) => axiosClient.put(`/api/products/${id}`, data),

  disableProduct: (id) =>
    axiosClient.put(`/api/products/disable-product/${id}`),
};

export default productService;
