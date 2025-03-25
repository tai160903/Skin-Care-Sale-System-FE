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
  DialogActions,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const limit = 10;
      let response;
      if (statusFilter === "All") {
        response = await orderService.getAllOrders({ page, limit });
      } else {
        response = await orderService.getOrdersByStatus(
          statusFilter,
          page,
          limit,
        );
      }
      setOrders(response?.data?.data || []);
      setTotalPages(response?.data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch orders", error);
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
        return "Đã hủy";
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

  const handleOpenConfirmModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setOpenConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, order_status: newStatus }
            : order,
        ),
      );
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setOpenConfirmModal(false);
    } catch (error) {
      console.error("Error updating order status:", error.error);
      toast.error(error.error || "Không thể cập nhật trạng thái!");
      setOpenConfirmModal(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a237e" }}>
            📦 Order Management
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
            sx={{ borderRadius: 20, textTransform: "none" }}
          >
            Refresh
          </Button>
        </Box>

        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            sx={{
              minWidth: 200,
              bgcolor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#115293",
              },
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <MenuItem value="All">Tất cả đơn hàng</MenuItem>
            <MenuItem value="Pending Confirmation">Đang chờ xác nhận</MenuItem>
            <MenuItem value="Complete Confirmation">Đã xác nhận</MenuItem>
            <MenuItem value="Cancelled">Đã hủy</MenuItem>
          </Select>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#1976d2" }}>
                    {["Order ID", "Customer ID", "Order Status", "Time"].map(
                      (header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: "#fff",
                            fontWeight: 600,
                            textAlign: "center",
                          }}
                        >
                          {header}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow
                        key={order._id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#f5f5f5" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell align="center">{order._id}</TableCell>
                        <TableCell align="center">
                          {order.customer_id}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Select
                              value={order.order_status}
                              onChange={(e) =>
                                handleOpenConfirmModal(order, e.target.value)
                              }
                              sx={{
                                minWidth: 140,
                                bgcolor: "#fff",
                                borderRadius: 1,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#ddd",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#1976d2",
                                },
                                "& .MuiSvgIcon-root": { color: "#1976d2" },
                              }}
                              renderValue={(selected) => (
                                <Typography sx={{ fontWeight: 500 }}>
                                  {getStatusLabel(selected)}
                                </Typography>
                              )}
                            >
                              <MenuItem value="confirmed">
                                Xác nhận đơn hàng
                              </MenuItem>
                              <MenuItem value="cancelled">
                                Hủy đơn hàng
                              </MenuItem>
                            </Select>
                            <Chip
                              label={getStatusLabel(order.order_status)}
                              color={getStatusColor(order.order_status)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {new Date(order.createdAt).toLocaleString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 4, color: "#757575" }}
                      >
                        Không tìm thấy đơn hàng.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 600 }}
          >
            Xác nhận thay đổi trạng thái
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>
              Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng thành{" "}
              <strong>{getStatusLabel(newStatus)}</strong> không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmModal(false)}
              color="error"
              variant="outlined"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              color="primary"
              variant="contained"
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default OrderManagement;
