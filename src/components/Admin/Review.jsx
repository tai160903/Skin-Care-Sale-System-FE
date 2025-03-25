import { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Paper,
  Rating,
  Divider,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify"; // Thêm toast để thông báo

const Review = () => {
  const [reviews, setReviews] = useState([]);

  // Lấy tất cả đánh giá
  const fetchAllReviews = async () => {
    try {
      const response = await reviewService.getAllReviews();

      setReviews(response?.data.data || []);
      toast.success("Tải danh sách đánh giá thành công!");
    } catch (error) {
      console.error("Lỗi khi lấy tất cả đánh giá:", error);
      setReviews([]);
      toast.error("Không thể tải danh sách đánh giá!");
    }
  };

  // Xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success("Xóa đánh giá thành công!");
        fetchAllReviews(); // Cập nhật lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        toast.error("Không thể xóa đánh giá!");
      }
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          ⭐ Danh sách đánh giá
        </Typography>
      </Box>

      {reviews.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          Không có đánh giá nào
        </Typography>
      ) : (
        <List
          sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2 }}
        >
          {reviews.map((review, index) => (
            <Box key={review._id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  "&:hover": { bgcolor: "#f1f3f5" },
                  transition: "background-color 0.2s",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={review.product_id?.name}
                    src={review.product_id?.image}
                    sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {review.product_id?.name || "Sản phẩm không xác định"}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        <strong>Khách hàng:</strong>{" "}
                        {review.customer_id?.name || "Ẩn danh"}
                      </Typography>
                      <Rating
                        value={review.rating || 0}
                        readOnly
                        precision={0.5}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        sx={{ display: "block" }}
                      >
                        {review.comment || "Không có bình luận"}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {new Date(review.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                    </>
                  }
                />
                <Tooltip title="Xóa đánh giá">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteReview(review._id)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </ListItem>
              {index < reviews.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default Review;
