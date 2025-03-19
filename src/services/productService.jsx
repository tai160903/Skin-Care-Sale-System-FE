import axiosClient from "./api.config";

const productService = {
  getAllProduct: ({ q, page, limit, category }) => {
    let params = new URLSearchParams();

    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (!q && page && limit) {
      params.append("page", page);
      params.append("limit", limit);
    }

    return axiosClient.get(`/api/products?${params.toString()}`);
  },

  getAllCategory: () => axiosClient.get(`/api/categories`),

  getCategories: () => axiosClient.get("/api/categories"),

  getProductById: (id) => axiosClient.get(`/api/products/${id}`),

  createProduct: (data) => axiosClient.post("/api/products", data),

  updateProduct: (id, data) => axiosClient.put(`/api/products/${id}`, data),

  disableProduct: (id) =>
    axiosClient.put(`/api/products/disable-product/${id}`),
};

export default productService;
