import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Chip,
  Button,
  ButtonGroup,
  TextField,
} from "@mui/material";
import { LocalShipping, CreditCard, MonetizationOn } from "@mui/icons-material";

const OrderTr = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchDate, setSearchDate] = useState("");
  const { customerId } = useParams();
  const navigate = useNavigate();

  // Fetch dữ liệu đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customerId=${customerId}`,
        );
        const orderData = res.data?.data?.data || [];
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        console.error("Error fetching order tracking data:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  // Lọc đơn hàng theo trạng thái và ngày
  useEffect(() => {
    let filtered = [...orders];
    if (filter !== "All") {
      filtered = filtered.filter((order) => order.shipping_status === filter);
    }
    if (searchDate) {
      filtered = filtered.filter(
        (order) =>
          order.createdAt &&
          new Date(order.createdAt).toISOString().split("T")[0] === searchDate,
      );
    }
    setFilteredOrders(filtered);
  }, [filter, searchDate, orders]);

  // Xác định màu và biểu tượng cho phương thức thanh toán
  const getPaymentChip = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return { label: "Stripe", color: "warning", icon: <CreditCard /> };
      case "cash":
        return {
          label: "Tiền mặt",
          color: "success",
          icon: <MonetizationOn />,
        };
      default:
        return { label: method || "N/A", color: "default", icon: null };
    }
  };

  // Trạng thái loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  // Chuyển hướng đến chi tiết đơn hàng
  const handleViewDetails = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

  return (
    <>
      <Box sx={{ maxWidth: "1200px", mx: "auto", py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
          }}
        >
          <ButtonGroup variant="outlined" color="primary">
            {["All", "Pending", "Cancelled", "Shipped", "Delivered"].map(
              (status) => (
                <Button
                  key={status}
                  onClick={() => setFilter(status)}
                  sx={{
                    bgcolor: filter === status ? "primary.main" : "transparent",
                    color: filter === status ? "white" : "primary.main",
                    "&:hover": {
                      bgcolor: filter === status ? "primary.dark" : "grey.100",
                    },
                    fontWeight: "bold",
                  }}
                >
                  {status === "All" ? "Tất cả" : status}
                </Button>
              ),
            )}
          </ButtonGroup>
          <TextField
            type="date"
            label="Tìm theo ngày"
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            sx={{ minWidth: "200px", bgcolor: "white", borderRadius: 1 }}
            variant="outlined"
          />
        </Box>

        {/* Bảng theo dõi đơn hàng */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              p: 2,
              fontWeight: "bold",
              color: "white",
              bgcolor: "primary.main",
              textAlign: "center",
            }}
          >
            Theo dõi đơn hàng
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.200" }}>
                {[
                  "Đơn hàng",
                  "Tổng thanh toán",
                  "Số điện thoại",
                  "Trạng thái giao hàng",
                  "Địa chỉ",
                  "Phương thức thanh toán",
                  "Ngày",
                  "Hành động",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ fontWeight: "bold", color: "grey.800", py: 2 }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const paymentInfo = getPaymentChip(
                    order.order_id?.payment_method,
                  );
                  return (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "primary.light",
                          transition: "0.3s",
                        },
                      }}
                    >
                      <TableCell>{order._id || "N/A"}</TableCell>
                      <TableCell>
                        {order.order_id?.totalPay
                          ? `${order.order_id.totalPay.toLocaleString("vi-VN")} VND`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{order.shipping_phone || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.shipping_status || "Không xác định"}
                          color={
                            order.shipping_status === "Shipped"
                              ? "info"
                              : order.shipping_status === "Pending"
                                ? "warning"
                                : order.shipping_status === "Cancelled"
                                  ? "error"
                                  : order.shipping_status === "Delivered"
                                    ? "success"
                                    : "default"
                          }
                          icon={<LocalShipping />}
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                      <TableCell>{order.shipping_address || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={paymentInfo.label}
                          color={paymentInfo.color}
                          icon={paymentInfo.icon}
                          sx={{ fontWeight: "medium" }}
                        />
                      </TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetails(order.order_id._id)}
                          sx={{ borderRadius: 1, px: 2 }}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary" sx={{ py: 4 }}>
                      Không tìm thấy đơn hàng nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default OrderTr;
