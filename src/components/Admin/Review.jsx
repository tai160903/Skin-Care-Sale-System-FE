import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [message, setMessage] = useState({ open: false, type: "", text: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [reviews, searchQuery, ratingFilter]);

  const fetchReviews = async () => {
    try {
      const data = await reviewsService.getAllReviews();
      setReviews(data);
    } catch (error) {
      showMessage("error", "Lỗi khi tải danh sách đánh giá");
    }
  };

  const handleSearch = () => {
    let filtered = reviews;
    if (searchQuery.trim()) {
      filtered = filtered.filter((review) =>
        review.product.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (ratingFilter > 0) {
      filtered = filtered.filter((review) => review.rating === ratingFilter);
    }
    setFilteredReviews(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await reviewsService.deleteReview(id);
        showMessage("success", "Xóa đánh giá thành công!");
        fetchReviews();
      } catch (error) {
        showMessage("error", "Lỗi khi xóa đánh giá");
      }
    }
  };

  const handleRespond = (review) => {
    setSelectedReview(review);
    setResponseDialog(true);
  };

  const sendResponse = async () => {
    try {
      await reviewsService.respondToReview(selectedReview.id, responseText);
      showMessage("success", "Phản hồi đánh giá thành công!");
      setResponseDialog(false);
      setResponseText("");
    } catch (error) {
      showMessage("error", "Lỗi khi gửi phản hồi!");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ open: true, type, text });
  };

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <TextField
          label="Tìm kiếm theo sản phẩm"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value={0}>Tất cả sao</MenuItem>
          {[5, 4, 3, 2, 1].map((star) => (
            <MenuItem key={star} value={star}>
              {star}⭐
            </MenuItem>
          ))}
        </Select>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Sản phẩm</b></TableCell>
              <TableCell><b>Người đánh giá</b></TableCell>
              <TableCell><b>Đánh giá</b></TableCell>
              <TableCell><b>Nội dung</b></TableCell>
              <TableCell><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.product}</TableCell>
                <TableCell>{review.user}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly />
                </TableCell>
                <TableCell>{review.content}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleRespond(review)}
                    style={{ marginRight: "5px" }}
                  >
                    Phản hồi
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(review.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={responseDialog} onClose={() => setResponseDialog(false)}>
        <DialogTitle>Phản hồi đánh giá</DialogTitle>
        <DialogContent>
          <TextField
            label="Phản hồi"
            fullWidth
            multiline
            rows={3}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={sendResponse} color="primary" variant="contained">
            Gửi
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={message.open}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Review;
