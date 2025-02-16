import axiosClient from "./api.config";

const productService = {
  getAllProduct: () => axiosClient.get("/api/products"),
  getProductById: (id) => axiosClient.get(`/api/products/${id}`), // ✅ Thêm API lấy sản phẩm theo ID
};

export default productService;
