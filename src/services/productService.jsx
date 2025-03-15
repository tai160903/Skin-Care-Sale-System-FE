import axiosClient from "./api.config";

const productService = {
  getAllProduct: ({ page, limit }) =>
    axiosClient.get(`/api/products?page=${page}&limit=${limit}`),

  getProductById: (id) => axiosClient.get(`/api/products/${id}`),

  createProduct: (data) => axiosClient.post("/api/products", data),

  updateProduct: (id, data) => axiosClient.put(`/api/products/${id}`, data),
};

export default productService;
