import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useNavigate } from "react-router-dom";
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
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { LocalShipping, CreditCard, MonetizationOn } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const OrderTracking = () => {
  const { customerId } = useOutletContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!customerId) {
      console.error("customerId chưa được xác định");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customer_id=${customerId}`,
        );
        const orderData = res.data?.data?.data || [];
        const filteredData = orderData.filter(
          (order) =>
            order.shipping_status === "Delivered" ||
            order.shipping_status === "Cancelled",
        );
        setOrders(filteredData);
        setFilteredOrders(filteredData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredOrders(orders);
  };

  // Hàm xử lý khi nhấn nút "Mua lại"
  const handleBuyAgain = (orderId) => {
    // Giả sử order.order_id chứa thông tin sản phẩm đã đặt
    // Chuyển hướng đến trang chi tiết sản phẩm hoặc giỏ hàng
    navigate(`/detail/${orderId}`); // Điều chỉnh đường dẫn theo cấu trúc route của bạn
  };

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
        return {
          label: method || "Không xác định",
          color: "default",
          icon: null,
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Cancelled":
        return "Đã hủy";
      case "Delivered":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

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

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <TextField
          label="Tìm mã đơn hàng"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                {searchQuery && (
                  <IconButton onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton onClick={handleSearch}>
                  <SearchIcon color="primary" />
                </IconButton>
              </>
            ),
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          sx={{ width: "100%", maxWidth: 400 }}
        />
      </Box>

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
          Lịch sử mua hàng
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.200" }}>
              {[
                "Mã đơn hàng",
                "Số điện thoại",
                "Trạng thái",
                "Địa chỉ giao hàng",
                "Phương thức thanh toán",
                "Ngày đặt hàng",
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
                        transition: "background-color 0.3s",
                      },
                    }}
                  >
                    <TableCell>{order._id || "Không xác định"}</TableCell>
                    <TableCell>
                      {order.shipping_phone || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.shipping_status)}
                        color={
                          order.shipping_status === "Cancelled"
                            ? "error"
                            : order.shipping_status === "Delivered"
                              ? "success"
                              : "default"
                        }
                        icon={<LocalShipping />}
                        sx={{ fontWeight: "medium" }}
                      />
                    </TableCell>
                    <TableCell>
                      {order.shipping_address || "Không xác định"}
                    </TableCell>
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
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "Không xác định"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() =>
                          handleBuyAgain(order.order_id?._id || order._id)
                        }
                        size="small"
                      >
                        Mua lại
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary" sx={{ py: 4 }}>
                    Không tìm thấy đơn hàng nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderTracking;
