import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Chip,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State để mở modal xác nhận
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response;
      if (statusFilter === "All") {
        response = await orderService.getAllOrders(page, 10);
      } else {
        response = await orderService.getOrdersByStatus(statusFilter, page, 10);
      }

      setOrders(response?.data?.data?.data || []);
      setTotalPages(response?.data?.data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đơn Hàng đã bị Hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  // Mở modal xác nhận khi chọn trạng thái mới
  const handleOpenConfirmModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setOpenConfirmModal(true);
  };

  // Xác nhận thay đổi trạng thái đơn hàng
  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? { ...order, order_status: newStatus } : order
        )
      );
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      console.error("Error updating order status:", error.error);
      toast.error(error.error);
      setOpenConfirmModal(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          📦 Order Management
        </Typography>
        <Button
          onClick={fetchOrders}
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
        >
          Refresh Orders
        </Button>
      </Box>

      <Select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
        sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: 2 }}
      >
        <MenuItem value="All">All Orders</MenuItem>
        <MenuItem value="Pending Confirmation">Pending Confirmation</MenuItem>
        <MenuItem value="Complete Confirmation">Complete Confirmation</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} sx={{ backgroundColor: "white" }}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.customer_id}</TableCell>
                    <TableCell>
                    <Select
  value={order.order_status}
  onChange={(e) => handleOpenConfirmModal(order, e.target.value)}
  sx={{
    backgroundColor: "white",
    borderRadius: 2,
    minWidth: "140px",
    padding: "5px 10px",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      textAlign: "center",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ddd", // Viền mờ hơn cho đẹp
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1976d2", // Hiệu ứng viền khi hover
    },
    "& .MuiSvgIcon-root": {
      color: "#1976d2", // Màu mũi tên dropdown
    },
    boxShadow: 1, // Hiệu ứng bóng nhẹ
  }}
  displayEmpty
  renderValue={(selected) => getStatusLabel(selected)}
>
  <MenuItem value="confirmed">XÁC NHẬN ĐƠN HÀNG</MenuItem>
  <MenuItem value="Cancelled">HỦY ĐƠN HÀNG</MenuItem>
</Select>
                      <Chip
                      label={getStatusLabel(order.order_status)}
                      color={getStatusColor(order.order_status)}
                      sx={{ ml: 2, fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Modal xác nhận */}
      <Dialog open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmModal(false)} color="error">
            Hủy
          </Button>
          <Button onClick={handleConfirmStatusChange} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrderManagement;
