import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Pagination,
  Tooltip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Hàm lấy màu sắc cho trạng thái đơn hàng
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

// Hàm chuyển trạng thái sang tiếng Việt
const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Đang xử lý";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders({ page, limit });
      setTotalPages(data.data.totalPages || 1);
      setOrders(data.data.data || []);
      setFilteredOrders(data.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setOrders([]);
      setFilteredOrders([]);
      toast.error("Không thể tải danh sách đơn hàng!");
    }
  };

  const handleFilter = () => {
    let filtered = [...orders];

    // Áp dụng bộ lọc trạng thái
    if (statusFilter !== "Tất cả") {
      const statusMap = {
        "Đang xử lý": "pending",
        "Hoàn thành": "completed",
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

    // Áp dụng tìm kiếm theo mã đơn hàng
    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
    if (filtered.length === 0) {
      toast.warn("Không tìm thấy đơn hàng nào phù hợp!");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleFilter(); // Reapply filters without search query
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("Tất cả");
    setStartDate("");
    setEndDate("");
    setFilteredOrders(orders); // Reset to all orders
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset về trang 1 khi thay đổi trạng thái
  };

  return (
    <Paper
      sx={{
        padding: 4,
        borderRadius: 3,
        backgroundColor: "#f1f5f9",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 3 }}
        >
          📦 Quản Lý Đơn Hàng
        </Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Tìm kiếm theo ID đơn hàng"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ flex: 1, minWidth: 250, bgcolor: "#fff" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={handleFilter} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={handleStatusChange}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2563eb",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1d4ed8",
                },
              }}
            >
              <MenuItem value="Tất cả">Tất cả</MenuItem>
              <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
              <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
              <MenuItem value="Đã hủy">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearAllFilters}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              padding: "8px 16px",
              borderColor: "#d32f2f",
              color: "#d32f2f",
              "&:hover": {
                borderColor: "#b71c1c",
                color: "#b71c1c",
                backgroundColor: "#ffebee",
              },
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Box>

      <TableContainer
        sx={{ borderRadius: 2, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#2563eb" }}>
            <TableRow>
              {[
                "Mã đơn hàng",
                "Tổng tiền",
                "Sản phẩm",
                "Trạng thái",
                "Phương thức thanh toán",
                "Ngày tạo",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Không có đơn hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f1f5f9" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: "medium", color: "#1976d2" }}>
                    {order._id || "Không xác định"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {order.totalPay
                      ? `${order.totalPay.toLocaleString("vi-VN")} VNĐ`
                      : "Không xác định"}
                  </TableCell>
                  <TableCell>
                    <Accordion
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ backgroundColor: "#f9fafb" }}
                      >
                        <Typography sx={{ fontWeight: "medium" }}>
                          {order.items?.length || 0} sản phẩm
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2 }}>
                        {order.items?.map((item) => (
                          <Box
                            key={item._id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <Avatar
                              src={item.product_id?.image}
                              alt={item.product_id?.name}
                              sx={{
                                width: 60,
                                height: 60,
                                mr: 2,
                                borderRadius: 1,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", color: "#333" }}
                              >
                                {item.product_id?.name ||
                                  "Sản phẩm không xác định"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Số lượng: {item.quantity || 0}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Giá:{" "}
                                {item.priceAtTime?.toLocaleString("vi-VN") ||
                                  "Không xác định"}{" "}
                                VNĐ
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Danh mục:{" "}
                                {item.product_id?.category?.name ||
                                  "Không xác định"}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={order.order_status || "Không xác định"}>
                      <Chip
                        label={getStatusLabel(order.order_status)}
                        color={getStatusColor(order.order_status)}
                        sx={{ fontWeight: "bold", minWidth: 100 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium", color: "#2563eb" }}>
                    {order.payment_method
                      ? order.payment_method.toUpperCase()
                      : "Không xác định"}
                  </TableCell>
                  <TableCell sx={{ color: "#555" }}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Không xác định"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              fontSize: "1rem",
              "&:hover": { bgcolor: "#e0f2fe" },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default OrdersTable;
