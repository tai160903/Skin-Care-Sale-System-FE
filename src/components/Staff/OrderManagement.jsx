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
  TextField,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const limit = 10;
      const response = await orderService.getAllOrders({ page, limit });
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initially show all orders
        setTotalPages(response.data.totalPages || 1);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // Hàm áp dụng tất cả các bộ lọc (giống ShipManagement)
  const applyFilters = (data) => {
    let filtered = [...data];

    // Áp dụng bộ lọc trạng thái
    if (statusFilter !== "Tất cả") {
      const statusMap = {
        "Đang chờ xác nhận": "pending",
        "Đã xác nhận": "confirmed",
        "Đã hoàn thành": "completed",
        "Đã hủy": "cancelled",
      };
      filtered = filtered.filter(
        (order) => order.order_status.toLowerCase() === statusMap[statusFilter],
      );
    }

    // Áp dụng bộ lọc ngày
    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= new Date(startDate),
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) <= new Date(endDate),
      );
    }

    // Áp dụng tìm kiếm theo mã đơn hàng hoặc mã khách hàng
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    applyFilters(orders);
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery("");
    applyFilters(orders); // Áp dụng lại bộ lọc mà không có searchQuery
  };

  // useEffect để tự động áp dụng bộ lọc (trừ searchQuery)
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== "Tất cả") {
      const statusMap = {
        "Đang chờ xác nhận": "pending",
        "Đã xác nhận": "confirmed",
        "Đã hoàn thành": "completed",
        "Đã hủy": "cancelled",
      };
      filtered = filtered.filter(
        (order) => order.order_status.toLowerCase() === statusMap[statusFilter],
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= new Date(startDate),
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) <= new Date(endDate),
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, startDate, endDate, orders]);

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
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, order_status: newStatus }
            : order,
        ),
      );
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setOpenConfirmModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error.error);
      toast.error(error.error || "Không thể cập nhật trạng thái!");
      setOpenConfirmModal(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a237e" }}>
          📦 Quản Lý Đơn Hàng
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchOrders}
          sx={{ borderRadius: 20, textTransform: "none" }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Filter Section (Giống ShipManagement) */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
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
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trạng Thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng Thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="Tất cả">Tất cả</MenuItem>
            <MenuItem value="Đang chờ xác nhận">Đang chờ xác nhận</MenuItem>
            <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Ngày Bắt Đầu"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="Ngày Kết Thúc"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
        />
      </Box>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1976d2" }}>
                  {[
                    "Mã đơn hàng",
                    "Mã khách hàng",
                    "Trạng thái",
                    "Thời gian",
                  ].map((header) => (
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
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#e3f2fd" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell align="center">{order._id}</TableCell>
                      <TableCell align="center">{order.customer_id}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={getStatusLabel(order.order_status)}
                            color={getStatusColor(order.order_status)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: 100,
                              bgcolor:
                                order.order_status.toLowerCase() === "completed"
                                  ? "#4caf50"
                                  : undefined,
                              color:
                                order.order_status.toLowerCase() === "completed"
                                  ? "white"
                                  : undefined,
                            }}
                          />
                          {order.order_status !== "cancelled" &&
                            order.order_status !== "completed" && (
                              <Select
                                value={order.order_status}
                                onChange={(e) =>
                                  handleOpenConfirmModal(order, e.target.value)
                                }
                                sx={{
                                  minWidth: 140,
                                  height: 32,
                                  bgcolor: "#fff",
                                  borderRadius: 1,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#ddd",
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#0288d1",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor: "#1976d2",
                                    },
                                  "& .MuiSvgIcon-root": { color: "#1976d2" },
                                }}
                              >
                                <MenuItem value="confirmed">Xác Nhận</MenuItem>
                                <MenuItem value="cancelled">Hủy</MenuItem>
                              </Select>
                            )}
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                showFirstButton
                showLastButton
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
            sx={{
              color: "#d32f2f",
              textTransform: "none",
              "&:hover": { backgroundColor: "#ffebee" },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmStatusChange}
            sx={{
              backgroundColor: "#0288d1",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#0277bd" },
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default OrderManagement;
