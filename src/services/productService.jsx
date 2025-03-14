import axiosClient from "./api.config";

const productService = {
  getAllProduct: ({ page, limit }) =>
    axiosClient.get(`/api/products?page=${page}&limit=${limit}`),

  getProductById: (id) => axiosClient.get(`/api/products/${id}`),
};

export default productService;
