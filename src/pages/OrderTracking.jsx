import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
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
  Pagination, // Thêm Pagination từ MUI
} from "@mui/material";
import { LocalShipping, CreditCard, MonetizationOn } from "@mui/icons-material";

const OrderTracking = () => {
  const { customerId } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const ordersPerPage = 7; // Số đơn hàng mỗi trang (có thể thay đổi)

  // Fetch danh sách đơn hàng khi customerId hoặc page thay đổi
  useEffect(() => {
    if (!customerId) {
      console.error("customerId is undefined");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customer_id=${customerId}&page=${page}&limit=${ordersPerPage}`
        );
        const data = res.data?.data || {};
        console.log(data);
        setOrders(data.data || []); 
        setTotalPages(data.totalPages); 
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, page]); // Thêm page vào dependency array

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xác định màu và biểu tượng cho phương thức thanh toán
  const getPaymentChip = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return { label: "Stripe", color: "warning", icon: <CreditCard /> };
      case "cash":
        return { label: "Tiền mặt", color: "success", icon: <MonetizationOn /> };
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

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", py: 4 }}>
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
          Lịch sử đơn hàng
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.200" }}>
              {[
                "Mã đơn hàng",
                "Số điện thoại",
                "Trạng thái",
                "Địa chỉ",
                "Thanh toán",
                "Ngày đặt",
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
            {orders.length > 0 ? (
              orders.map((order) => {
                const paymentInfo = getPaymentChip(order.order_id?.payment_method);
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
                    <TableCell>{order._id || "N/A"}</TableCell>
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
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" sx={{ py: 4 }}>
                    Chưa có đơn hàng nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderTracking;