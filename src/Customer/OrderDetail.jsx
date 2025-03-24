import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Rating,
} from "@mui/material";
import orderService from "../services/orderService";
import axios from "axios";
import { toast } from "react-toastify";
import shipService from "../services/adminService/shipService";

const OrderDetail = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
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

  const [openIndex, setOpenIndex] = useState(null); // Theo dõi sản phẩm đang mở modal
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});

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

      // Đóng modal sau khi đánh giá thành công
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
  if (!order) return <Typography align="center">Order not found</Typography>;

  console.log("ship:", shipping);

  return (
    <Box maxWidth="800px" mx="auto" my={4}>
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
                <ListItemText primary="Status" secondary={order.order_status} />
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

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: "auto" }}
                  onClick={() => setOpenIndex(index)}
                >
                  Đánh giá
                </Button>

                <Dialog
                  open={openIndex === index}
                  onClose={() => setOpenIndex(null)}
                >
                  <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                  <DialogContent>
                    {/* Rating để đánh giá sao */}
                    <Rating
                      value={ratings[index] || 0}
                      precision={0.5} // Cho phép đánh giá 0.5 sao
                      onChange={(event, newValue) =>
                        setRatings({ ...ratings, [index]: newValue })
                      }
                    />

                    {/* TextField để nhập đánh giá */}
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
            Tổng giá trị đơn hàng:{" "}
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
          Shipping & Payment Details
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
              primary="Shipping Address"
              secondary={shipping?.[0]?.shipping_address || "N/A"}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Payment Method"
              secondary={order.payment_method || "N/A"}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Order Date"
              secondary={new Date(order.createdAt).toLocaleDateString()}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default OrderDetail;
