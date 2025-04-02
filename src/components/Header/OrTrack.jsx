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
  IconButton,
} from "@mui/material";
import { LocalShipping, CreditCard, MonetizationOn } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const OrderTr = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchDate, setSearchDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho tìm kiếm mã đơn hàng
  const { customerId } = useParams();
  const navigate = useNavigate();

  // Fetch dữ liệu đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings/customer/${customerId}`,
        );
        const orderData = res.data?.data || [];
        console.log("res:", res.data);
        setOrders(orderData);
        setFilteredOrders(orderData); // Hiển thị toàn bộ đơn hàng ban đầu
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu theo dõi đơn hàng:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  // Lọc đơn hàng theo trạng thái, ngày và mã đơn hàng
  const applyFilters = () => {
    let filtered = [...orders];

    // Lọc theo trạng thái
    if (filter !== "All") {
      filtered = filtered.filter((order) => order.shipping_status === filter);
    }

    // Lọc theo ngày
    if (searchDate) {
      filtered = filtered.filter(
        (order) =>
          order.createdAt &&
          new Date(order.createdAt).toISOString().split("T")[0] === searchDate,
      );
    }

    // Lọc theo mã đơn hàng
    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  };

  // Hàm tìm kiếm khi nhấn nút
  const handleSearch = () => {
    applyFilters();
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery("");
    applyFilters(); // Áp dụng lại bộ lọc mà không có searchQuery
  };

  // Áp dụng bộ lọc khi thay đổi trạng thái hoặc ngày
  useEffect(() => {
    applyFilters();
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
        return {
          label: method || "Không xác định",
          color: "default",
          icon: null,
        };
    }
  };

  // Hàm chuyển trạng thái sang tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case "Shipped":
        return "Đang vận chuyển";
      case "Pending":
        return "Chờ xử lý";
      case "Cancelled":
        return "Đã hủy";
      case "Delivered":
        return "Đã giao";
      default:
        return "Không xác định";
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
      <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
        {/* Header Section */}
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
          <ButtonGroup variant="outlined" color="primary">
            {[
              { value: "All", label: "Tất cả" },
              { value: "Pending", label: "Chờ xử lý" },
              { value: "Cancelled", label: "Đã hủy" },
              { value: "Shipped", label: "Đang vận chuyển" },
              { value: "Delivered", label: "Đã giao" },
            ].map((status) => (
              <Button
                key={status.value}
                onClick={() => setFilter(status.value)}
                sx={{
                  bgcolor:
                    filter === status.value ? "primary.main" : "transparent",
                  color: filter === status.value ? "white" : "primary.main",
                  "&:hover": {
                    bgcolor:
                      filter === status.value ? "primary.dark" : "grey.100",
                  },
                  fontWeight: "bold",
                }}
              >
                {status.label}
              </Button>
            ))}
          </ButtonGroup>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              type="date"
              label="Tìm theo ngày"
              InputLabelProps={{ shrink: true }}
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              sx={{ minWidth: "200px", bgcolor: "white", borderRadius: 1 }}
              variant="outlined"
            />
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
              sx={{ minWidth: "250px", bgcolor: "white", borderRadius: 1 }}
            />
          </Box>
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
                  "Mã đơn hàng",
                  "Tổng thanh toán",
                  "Số điện thoại",
                  "Trạng thái giao hàng",
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
                          transition: "0.3s",
                        },
                      }}
                    >
                      <TableCell>{order._id || "Không xác định"}</TableCell>
                      <TableCell>
                        {order.order_id?.totalPay
                          ? `${order.order_id.totalPay.toLocaleString("vi-VN")} VND`
                          : "Không xác định"}
                      </TableCell>
                      <TableCell>
                        {order.shipping_phone || "Không xác định"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.shipping_status)}
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
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )
                          : "Không xác định"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetails(order.order_id._id)}
                          sx={{ borderRadius: 1, px: 2 }}
                        >
                          Xem chi tiết
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
      </Paper>
    </>
  );
};

export default OrderTr;