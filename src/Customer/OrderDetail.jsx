import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from "@mui/material";
import orderService from "../services/orderService";
import axios from "axios";
import { toast } from "react-toastify";
import shipService from "../services/adminService/shipService";
import UploadImage from "../components/UploadImage";

const OrderDetail = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(null);
  const [returnedProducts, setReturnedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedReturnedProducts = localStorage.getItem("returnedProducts");
    if (savedReturnedProducts) {
      setReturnedProducts(JSON.parse(savedReturnedProducts));
    }
    const fetchDetails = async () => {
      try {
        const orderRes = await orderService.getOrderById(order_id);
        setOrder(orderRes.data);

        const shippingRes = await shipService.getShippingByOrderId(order_id);
        setShipping(shippingRes.data?.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [order_id]);

  const [openIndex, setOpenIndex] = useState(null); // Theo dõi sản phẩm đang mở modal đánh giá
  const [returnOpenIndex, setReturnOpenIndex] = useState(null); // Theo dõi sản phẩm đang mở modal trả hàng
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [reason, setReason] = useState(""); // Lý do trả hàng
  const [imageUrl, setImageUrl] = useState(""); // URL ảnh trả hàng

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={50} />
      </Box>
    );

  const handleReturnRequest = async (productId) => {
    if (!reason || !imageUrl) {
      toast.error("Vui lòng điền lý do và upload ảnh!");
      return;
    }
    console.log("customerId:", order.customer_id)

    try {
      const restore = await axios.post(`http://localhost:8080/api/restore`, {
        product_id: productId,
        order_id: order._id,
        customer_id: order.customer_id,
        quantity: 1,
        reason: reason,
        image: imageUrl,
      });
      console.log("Restore response:", restore);
      toast.success("Yêu cầu trả hàng đã được gửi!");
      setReturnedProducts((prev) => {
        const updated = [...prev, productId];
        localStorage.setItem("returnedProducts", JSON.stringify(updated)); // Lưu vào localStorage
        return updated;
      });
      setReturnOpenIndex(null); // Đóng modal sau khi gửi thành công
    } catch (error) {
      console.error("Error in return request:", error);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu trả hàng!");
    }
  };

  const handleSubmitReview = async (index, productId) => {
    if (!ratings[index]) {
      alert("Vui lòng chọn số sao trước khi gửi đánh giá!");
      return;
    }
    const reviewData = {
      customer_id: order.customer_id,
      product_id: productId,
      rating: ratings[index] || 0,
      comment: reviews[index] || "",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/reviews",
        reviewData,
      );
      console.log("Đánh giá thành công:", response.data);
      toast.success("Đánh giá của bạn đã được gửi!", {
        position: "top-right",
        autoClose: 3000,
      });
      setOpenIndex(null);
    } catch (error) {
      if (error.response) {
        console.log("Error:", error.response);
        if (error.response.status === 400) {
          toast.error(
            error.response.data.message || "Lỗi yêu cầu không hợp lệ!",
            {
              position: "top-right",
              autoClose: 3000,
            },
          );
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        toast.error("Không thể kết nối đến server!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleImageUploadSuccess = (url) => {
    setImageUrl(url);
  };

  if (!order) return <Typography align="center">Order not found</Typography>;

  console.log("ship:", shipping);

  return (
    <Box maxWidth="800px" mx="auto" my={4}>
      <button
        onClick={() => navigate("/")}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out mb-6"
      >
        Quay về Trang Chủ
      </button>
      {/* Khung chứa Order ID và Status */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          Order Summary
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List>
              <ListItem>
                <ListItemText primary="Order ID" secondary={order._id} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Typography
                      sx={{
                        color:
                          order.order_status === "pending"
                            ? "orange"
                            : order.order_status === "confirmed"
                              ? "blue"
                              : order.order_status === "completed"
                                ? "green"
                                : order.order_status === "cancelled"
                                  ? "red"
                                  : "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      {order.order_status === "pending"
                        ? "Chờ xác nhận"
                        : order.order_status === "confirmed"
                          ? "Đã xác nhận"
                          : order.order_status === "completed"
                            ? "Đã hoàn thành"
                            : order.order_status === "cancelled"
                              ? "Đã hủy"
                              : order.order_status}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Danh sách sản phẩm */}
        <Paper
          elevation={2}
          sx={{ p: 2, bgcolor: "white", mt: 2, borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight="bold" color="textPrimary" mb={1}>
            Ordered Products
          </Typography>

          <List>
            {order.items.map((product, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom:
                    index !== order.items.length - 1
                      ? "1px solid #ddd"
                      : "none",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <ListItem
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={product.product_id.image}
                      alt={product.product_id.name}
                      variant="square"
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={product.product_id.name}
                    secondary={
                      <>
                        <Typography component="span">
                          <strong>Giá:</strong>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.product_id?.price || 0)}
                        </Typography>
                        <Typography component="span" sx={{ display: "block" }}>
                          <strong>Số lượng:</strong> {product.quantity}
                        </Typography>
                      </>
                    }
                    sx={{ display: "flex", flexDirection: "column" }}
                  />
                </ListItem>

                {/* Nút Đánh giá */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: "auto" }}
                  onClick={() => setOpenIndex(index)}
                >
                  Đánh giá
                </Button>

                {/* Nút Trả hàng */}
                {order.order_status === "completed" &&
                  !returnedProducts.includes(product.product_id._id) && (
                    <Button
                      variant="contained"
                      sx={{
                        ml: 2,
                        backgroundColor: "#FF5722",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#E64A19",
                        },
                      }}
                      onClick={() => setReturnOpenIndex(index)}
                    >
                      Trả hàng
                    </Button>
                  )}

                {/* Dialog Đánh giá */}
                <Dialog
                  open={openIndex === index}
                  onClose={() => setOpenIndex(null)}
                >
                  <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                  <DialogContent>
                    <Rating
                      value={ratings[index] || 0}
                      precision={0.5}
                      onChange={(event, newValue) =>
                        setRatings({ ...ratings, [index]: newValue })
                      }
                    />
                    <TextField
                      label="Nhập đánh giá của bạn"
                      fullWidth
                      multiline
                      rows={3}
                      value={reviews[index] || ""}
                      onChange={(e) =>
                        setReviews({ ...reviews, [index]: e.target.value })
                      }
                      sx={{ mt: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenIndex(null)}
                      color="secondary"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() =>
                        handleSubmitReview(index, product.product_id._id)
                      }
                      color="primary"
                    >
                      Gửi đánh giá
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Dialog Trả hàng */}
                <Dialog
                  open={returnOpenIndex === index}
                  onClose={() => setReturnOpenIndex(null)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Điền thông tin trả hàng</DialogTitle>
                  <DialogContent>
                    <TextField
                      fullWidth
                      label="Lý do trả hàng"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                    <UploadImage onUploadSuccess={handleImageUploadSuccess} />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setReturnOpenIndex(null)}
                      color="secondary"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() =>
                        handleReturnRequest(product.product_id._id)
                      }
                      color="primary"
                    >
                      Gửi
                    </Button>
                  </DialogActions>
                </Dialog>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper
          elevation={2}
          sx={{ p: 2, bgcolor: "success.lighter", mt: 2, borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            textAlign="right"
          >
            Tổng giá sản phẩm:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.totalPay - order.shipping_price || 0)}
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            textAlign="right"
          >
            Phí vận chuyển:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.shipping_price || 0)}
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            textAlign="right"
          >
            Tổng thanh toán:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.totalPay || 0)}
          </Typography>
        </Paper>
      </Paper>

      {/* Khung chứa các thông tin còn lại */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Thông tin vận chuyển
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Số điện thoại"
              secondary={shipping?.[0]?.shipping_phone || "N/A"}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Địa chỉ giao hàng"
              secondary={shipping?.[0]?.shipping_address || "N/A"}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Thời gian"
              secondary={new Date(order.createdAt).toLocaleDateString("vi-VN")}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default OrderDetail;
