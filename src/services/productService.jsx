import axiosClient from "./api.config";

const productService = {
  getAllProducts: ({
    searchTerm = "",
    page = 1,
    limit = 20,
    categoryId,
    minPrice = 0,
    maxPrice = Infinity,
    sortBy,
  }) => {
    const params = new URLSearchParams();

    if (searchTerm) params.append("searchTerm", searchTerm);
    if (categoryId) params.append("categoryId", categoryId);
    if (page && limit) {
      params.append("page", page);
      params.append("limit", limit);
    }
    params.append("minPrice", minPrice);
    params.append("maxPrice", maxPrice);
    if (sortBy) params.append("sortBy", sortBy);

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
