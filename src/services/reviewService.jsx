import axiosClient from "./api.config";

const reviewService = {
  getReviewsByProductId: (productId) =>
    axiosClient.get(`/api/reviews/product/${productId}`),
};

export default reviewService;
