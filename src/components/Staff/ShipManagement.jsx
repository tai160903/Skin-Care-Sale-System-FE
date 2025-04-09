import { useEffect, useState } from "react";
import shipService from "../../services/adminService/shipService";
import { toast } from "react-toastify";
import {
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { formatCurrency } from "../../utils/formatCurrency";

const ShipManagement = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [reason, setReason] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await shipService.getAllShippings({ page, limit: 10 });
      if (response.data?.data && Array.isArray(response.data.data)) {
        setShipments(response.data.data);
        setFilteredShipments(response.data.data); // Hiển thị tất cả dữ liệu ban đầu
        setTotalPages(response.data.totalPages);
      } else {
        setShipments([]);
        setFilteredShipments([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vận chuyển:", error);
      toast.error("Không thể tải danh sách vận chuyển");
      setShipments([]);
      setFilteredShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page]);

  const statusMapping = {
    pending: { text: "Đang chờ xác nhận", color: "#FFA500" },
    confirmed: { text: "Đã xác nhận", color: "#00008B" },
    completed: { text: "Đã hoàn thành", color: "#008000" },
    cancelled: { text: "Đã hủy", color: "#FF0000" },
  };

  const applyFilters = (data) => {
    let filtered = [...data];

    // Áp dụng bộ lọc trạng thái
    if (statusFilter !== "Tất cả") {
      const statusMap = {
        "Chờ xử lý": "Pending",
        "Đang vận chuyển": "Shipping",
        "Đã giao": "Delivered",
        "Đã hủy": "Cancelled",
      };
      filtered = filtered.filter(
        (shipment) => shipment.shipping_status === statusMap[statusFilter],
      );
    }

    // Áp dụng bộ lọc ngày
    if (startDate) {
      filtered = filtered.filter(
        (shipment) => new Date(shipment.createdAt) >= new Date(startDate),
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (shipment) => new Date(shipment.createdAt) <= new Date(endDate),
      );
    }

    // Áp dụng tìm kiếm mã đơn hàng khi có searchQuery
    if (searchQuery.trim()) {
      filtered = filtered.filter((shipment) =>
        shipment.order_id._id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredShipments(filtered);
  };

  const handleSearch = () => {
    applyFilters(shipments); // Chỉ áp dụng bộ lọc khi nhấn nút Search
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Xóa searchQuery
    applyFilters(shipments); // Áp dụng lại bộ lọc mà không có searchQuery
  };

  // Chỉ áp dụng các bộ lọc khác (trạng thái, ngày) khi chúng thay đổi, không bao gồm searchQuery
  useEffect(() => {
    let filtered = [...shipments];

    if (statusFilter !== "Tất cả") {
      const statusMap = {
        "Chờ xử lý": "Pending",
        "Đang vận chuyển": "Shipping",
        "Đã giao": "Delivered",
        "Đã hủy": "Cancelled",
      };
      filtered = filtered.filter(
        (shipment) => shipment.shipping_status === statusMap[statusFilter],
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (shipment) => new Date(shipment.createdAt) >= new Date(startDate),
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (shipment) => new Date(shipment.createdAt) <= new Date(endDate),
      );
    }

    setFilteredShipments(filtered);
  }, [statusFilter, startDate, endDate, shipments]);

  const handleOpenStatusMenu = (event, shipment) => {
    setAnchorEl(event.currentTarget);
    setSelectedShipment(shipment);
  };

  const handleStatusChange = (status) => {
    setAnchorEl(null);
    if (status === "Cancelled") {
      setOpenDialog(true);
    } else {
      updateStatus(status);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedShipment) return;
    try {
      const response = await shipService.updateStatus(
        selectedShipment._id,
        status,
      );
      if (response?.data) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments();
      } else if (response?.message) {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const updateShipmentStatus = async () => {
    if (!selectedShipment || !reason.trim()) return;
    try {
      const response = await shipService.updateShippingStatus(
        selectedShipment._id,
        reason,
      );
      if (response && response._id) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchShipments();
        handleCloseDialog();
      } else {
        toast.error("Không thể cập nhật trạng thái!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShipment(null);
    setReason("");
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "#ffb300", color: "#fff" };
      case "Shipping":
        return { bgcolor: "#1976d2", color: "#fff" };
      case "Delivered":
        return { bgcolor: "#2e7d32", color: "#fff" };
      case "Cancelled":
        return { bgcolor: "#d32f2f", color: "#fff" };
      default:
        return { bgcolor: "#e0e0e0", color: "#000" };
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a237e" }}>
          📦 Quản Lý Vận Chuyển
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchShipments}
          sx={{ borderRadius: 20, textTransform: "none" }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Bộ lọc */}
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
            <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
            <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
            <MenuItem value="Đã giao">Đã giao</MenuItem>
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

      {loading ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography color="text.secondary">Đang tải danh sách...</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1976d2" }}>
                {[
                  "Mã Đơn Hàng",
                  "Tên Khách Hàng",
                  "Tổng Giá",
                  "Trạng Thái Đơn Hàng",
                  "Địa Chỉ Giao Hàng",
                  "Số Điện Thoại",
                  "Trạng Thái",
                  "Ngày Tạo",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "#fff", fontWeight: 600, textAlign: "center" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <TableRow
                    key={shipment._id}
                    hover
                    sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                  >
                    <TableCell align="center">
                      {shipment.order_id._id}
                    </TableCell>
                    <TableCell align="center">
                      {shipment?.shipping_name}
                    </TableCell>
                    <TableCell align="center">
                      {formatCurrency(shipment.order_id.totalPay)}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          color:
                            statusMapping[shipment.order_id.order_status].color,
                          fontWeight: "bold", // Làm chữ đậm
                        }}
                      >
                        {statusMapping[shipment.order_id.order_status].text}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          color:
                            statusMapping[shipment.order_id.order_status].color,
                          fontWeight: "bold", // Làm chữ đậm
                        }}
                      >
                        {statusMapping[shipment.order_id.order_status].text}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      {shipment.shipping_address}
                    </TableCell>
                    <TableCell align="center">
                      {shipment.shipping_phone}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Chip
                          label={
                            shipment.shipping_status === "Shipping"
                              ? "Đang Vận Chuyển"
                              : shipment.shipping_status === "Delivered"
                                ? "Đã Giao"
                                : shipment.shipping_status === "Cancelled"
                                  ? "Đã Hủy"
                                  : "Chờ Xử Lý"
                          }
                          sx={{
                            ...getStatusStyles(shipment.shipping_status),
                            fontWeight: 500,
                            minWidth: 120,
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenStatusMenu(e, shipment)}
                        >
                          <ArrowDropDownIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) &&
                            selectedShipment?._id === shipment._id
                          }
                          onClose={() => setAnchorEl(null)}
                        >
                          <MenuItem
                            onClick={() => handleStatusChange("Shipping")}
                          >
                            Đang Vận Chuyển
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusChange("Delivered")}
                          >
                            Đã Giao
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleStatusChange("Cancelled")}
                          >
                            Đã Hủy
                          </MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {new Date(shipment.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4, color: "#757575" }}
                  >
                    Không tìm thấy đơn vận chuyển nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Phân trang */}
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

      {/* Hộp thoại */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "#1976d2", color: "#fff", fontWeight: 600 }}
        >
          Cập Nhật Trạng Thái Vận Chuyển
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Lý Do Hủy"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            variant="outlined"
            placeholder="Nhập lý do nếu hủy đơn..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={updateShipmentStatus}
            color="primary"
            variant="contained"
            disabled={
              !reason.trim() &&
              selectedShipment?.shipping_status === "Cancelled"
            }
          >
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShipManagement;
