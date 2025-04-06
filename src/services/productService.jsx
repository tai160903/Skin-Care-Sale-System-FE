import axiosClient from "./api.config";

const productService = {
  getAllProducts: ({
    page = 1,
    limit = 20,
    category,
    minPrice = 0,
    maxPrice = Infinity,
    sortBy,
    q,
  }) => {
    const params = new URLSearchParams();

    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (page && limit) {
      params.append("page", page);
      params.append("limit", limit);
    }
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    if (sortBy) params.append("sortBy", sortBy);

    return axiosClient.get(`/api/products?${params.toString()}`);
  },

  getAll: () => axiosClient.get(`/api/products/getAll`),

  getAllCategory: () => axiosClient.get(`/api/categories`),

  getCategories: () => axiosClient.get("/api/categories"),

  getProductById: (id) => axiosClient.get(`/api/products/${id}`),

  createProduct: (data) => axiosClient.post("/api/products", data),

  updateProduct: (id, data) => axiosClient.put(`/api/products/${id}`, data),

  disableProduct: (id) =>
    axiosClient.put(`/api/products/disable-product/${id}`),
};

export default productService;
