import axiosClient from "./api.config";

const reviewService = {
  // Lấy đánh giá theo productId (hàm hiện có)
  getReviewsByProductId: (productId) =>
    axiosClient.get(`/api/reviews/product/${productId}`),

  // Lấy tất cả đánh giá
  getAllReviews: () =>
    axiosClient.get("/api/reviews", {
      headers: {
        Accept: "application/json",
      },
    }),

  // Xóa đánh giá theo ID
  deleteReview: (reviewId) =>
    axiosClient.delete(`/api/reviews/${reviewId}`, {
      headers: {
        Accept: "application/json",
      },
    }),
};

export default reviewService;
