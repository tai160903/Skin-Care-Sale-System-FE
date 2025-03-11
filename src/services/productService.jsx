import axiosClient from "./api.config";

const productService = {
  getAllProduct: () => axiosClient.get("/api/products"),
  getProductById: (id) => axiosClient.get(`/api/products/${id}`),
};

export default productService;
