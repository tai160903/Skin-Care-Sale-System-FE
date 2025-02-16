import axiosClient from "./api.config";

const productSerivce = {
  getAllProduct: () => axiosClient.get("/api/products"),
};

export default productSerivce;
