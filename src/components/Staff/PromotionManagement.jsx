import { useEffect, useState } from "react";
import {
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../services/adminService/promoService";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      toast.info("Đang tải danh sách khuyến mãi...");
      const data = await getPromotion();
      const promoData = Array.isArray(data) ? data : [];
      setPromotions(promoData);
      setFilteredPromotions(promoData);
      toast.success("Tải danh sách khuyến mãi thành công!");
    } catch (error) {
      console.error("Lỗi khi tải khuyến mãi:", error);
      setPromotions([]);
      setFilteredPromotions([]);
      toast.error("Không thể tải danh sách khuyến mãi!");
    }
  };

  const handleSearch = () => {
    toast.info("Đang tìm kiếm khuyến mãi...");
    let filtered = promotions || [];
    if (searchTerm.trim()) {
      filtered = filtered.filter((promo) =>
        (promo.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (startDateFilter) {
      filtered = filtered.filter(
        (promo) => new Date(promo.start_date) >= new Date(startDateFilter),
      );
    }
    if (endDateFilter) {
      filtered = filtered.filter(
        (promo) => new Date(promo.end_date) <= new Date(endDateFilter),
      );
    }
    setFilteredPromotions(filtered);
    if (filtered.length === 0) {
      toast.warn("Không tìm thấy khuyến mãi nào phù hợp!");
    } else {
      toast.success(`Đã lọc được ${filtered.length} khuyến mãi.`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setStartDateFilter("");
    setEndDateFilter("");
    setFilteredPromotions(promotions);
    toast.info("Đã xóa bộ lọc tìm kiếm!");
  };

  const handleOpenDialog = (promotion = null) => {
    if (promotion) {
      setEditingId(promotion._id);
      setFormData({
        name: promotion.name || "",
        code: promotion.code || "",
        description: promotion.description || "",
        discount_percentage: promotion.discount_percentage || "",
        start_date: promotion.start_date?.split("T")[0] || "",
        end_date: promotion.end_date?.split("T")[0] || "",
      });
      toast.info("Mở form chỉnh sửa khuyến mãi.");
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        code: "",
        description: "",
        discount_percentage: "",
        start_date: "",
        end_date: "",
      });
      toast.info("Mở form thêm khuyến mãi mới.");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    toast.info("Đã đóng form khuyến mãi.");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Validate tên khuyến mãi
    if (!(formData.name || "").trim()) {
      toast.error("Tên khuyến mãi không được để trống!");
      return false;
    }
    if (formData.name.length < 3) {
      toast.error("Tên khuyến mãi phải có ít nhất 3 ký tự!");
      return false;
    }
    if (!/^[a-zA-Z0-9\s-_]+$/.test(formData.name)) {
      toast.error(
        "Tên khuyến mãi chỉ được chứa chữ cái, số, dấu cách, dấu gạch ngang hoặc gạch dưới!",
      );
      return false;
    }

    // Validate mã khuyến mãi
    if (!(formData.code || "").trim()) {
      toast.error("Mã khuyến mãi không được để trống!");
      return false;
    }
    if (formData.code.length < 4) {
      toast.error("Mã khuyến mãi phải có ít nhất 4 ký tự!");
      return false;
    }
    if (!/^[A-Z0-9-]+$/.test(formData.code)) {
      toast.error(
        "Mã khuyến mãi chỉ được chứa chữ cái in hoa, số và dấu gạch ngang!",
      );
      return false;
    }

    // Validate mô tả (không bắt buộc, nhưng nếu có thì kiểm tra)
    if (formData.description && formData.description.length < 5) {
      toast.error("Mô tả (nếu có) phải có ít nhất 5 ký tự!");
      return false;
    }

    // Validate phần trăm giảm giá
    const discount = Number(formData.discount_percentage);
    if (formData.discount_percentage === "") {
      toast.error("Phần trăm giảm giá không được để trống!");
      return false;
    }
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Phần trăm giảm giá phải là số từ 0 đến 100!");
      return false;
    }

    // Validate ngày bắt đầu
    if (!formData.start_date) {
      toast.error("Ngày bắt đầu không được để trống!");
      return false;
    }
    const startDate = new Date(formData.start_date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày
    if (startDate < currentDate && !editingId) {
      toast.error("Ngày bắt đầu phải từ hôm nay trở đi khi tạo mới!");
      return false;
    }

    // Validate ngày kết thúc
    if (!formData.end_date) {
      toast.error("Ngày kết thúc không được để trống!");
      return false;
    }
    const endDate = new Date(formData.end_date);
    if (endDate <= startDate) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const promoData = {
      ...formData,
      discount_percentage: Number(formData.discount_percentage),
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    };

    try {
      toast.info(
        editingId ? "Đang cập nhật khuyến mãi..." : "Đang thêm khuyến mãi...",
      );
      if (editingId) {
        await updatePromotion(editingId, promoData);
        toast.success("Cập nhật khuyến mãi thành công!");
      } else {
        await createPromotion(promoData);
        toast.success("Tạo khuyến mãi thành công!");
      }
      fetchPromotions();
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu khuyến mãi:", error);
      toast.error(error.response?.data?.message || "Không thể lưu khuyến mãi!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        toast.info("Đang xóa khuyến mãi...");
        const result = await deletePromotion(id);
        if (result.success) {
          toast.success(result.message || "Xóa khuyến mãi thành công!");
          fetchPromotions();
        } else {
          toast.error(result.message || "Không thể xóa khuyến mãi!");
        }
      } catch (error) {
        toast.error("Lỗi khi xóa khuyến mãi: " + error.message);
      }
    } else {
      toast.info("Đã hủy thao tác xóa.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", p: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 3 }}
        >
          🎉 Quản Lý Khuyến Mãi
        </Typography>

        {/* Search and Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Tìm kiếm theo tên"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={handleClearSearch} edge="end">
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Bắt đầu từ"
            type="date"
            variant="outlined"
            size="small"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="Kết thúc đến"
            type="date"
            variant="outlined"
            size="small"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
        </Box>

        {/* Add Promotion Button */}
        <Button
          variant="contained"
          sx={{
            bgcolor: "#2563eb",
            "&:hover": { bgcolor: "#1d4ed8" },
            mb: 3,
            transition: "all 0.2s",
          }}
          onClick={() => handleOpenDialog()}
        >
          Thêm Khuyến Mãi
        </Button>

        {/* Promotion Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#3b82f6" }}>
              <TableRow>
                {[
                  "Tên",
                  "Mã",
                  "Mô Tả",
                  "Giảm Giá (%)",
                  "Bắt Đầu",
                  "Kết Thúc",
                  "Hành Động",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promo) => (
                  <TableRow
                    key={promo._id}
                    hover
                    sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}
                  >
                    <TableCell>{promo.name || "Không có tên"}</TableCell>
                    <TableCell>{promo.code || "Không có mã"}</TableCell>
                    <TableCell>
                      {promo.description?.substring(0, 50) || "Không có mô tả"}
                      {promo.description?.length > 50 && "..."}
                    </TableCell>
                    <TableCell>{promo.discount_percentage || 0}%</TableCell>
                    <TableCell>
                      {promo.start_date
                        ? new Date(promo.start_date).toLocaleDateString("vi-VN")
                        : "Không xác định"}
                    </TableCell>
                    <TableCell>
                      {promo.end_date
                        ? new Date(promo.end_date).toLocaleDateString("vi-VN")
                        : "Không xác định"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(promo)}
                        sx={{ mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(promo._id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      Không có khuyến mãi nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Promotion Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#dbeafe", color: "#1e40af" }}>
            {editingId ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Tên Khuyến Mãi"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 50 }}
              helperText={`${(formData.name || "").length}/50 ký tự`}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Mã Khuyến Mãi"
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 20 }}
              helperText={`${(formData.code || "").length}/20 ký tự`}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Mô Tả"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              inputProps={{ maxLength: 200 }}
              helperText={`${(formData.description || "").length}/200 ký tự`}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Phần Trăm Giảm Giá (%)"
              name="discount_percentage"
              type="number"
              value={formData.discount_percentage || ""}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Ngày Bắt Đầu"
              name="start_date"
              type="date"
              value={formData.start_date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Ngày Kết Thúc"
              name="end_date"
              type="date"
              value={formData.end_date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
            >
              {editingId ? "Cập Nhật" : "Thêm"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default PromotionManagement;
