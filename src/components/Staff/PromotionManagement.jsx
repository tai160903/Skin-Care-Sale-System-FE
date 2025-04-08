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
import managementPromotionService from "../../services/managementPromotionService";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [promotionOptions, setPromotionsOptions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogOptionsOptions, setOpenDialogOptions] = useState(false);
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
    fetchPromotionOptions();
  }, []);

  const fetchPromotionOptions = async () => {
    try {
      const response = await managementPromotionService.getAllPromotion();
      setPromotionsOptions(response.data.data);
    } catch (error) {
      console.error("Lỗi hệ thống!", error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const data = await getPromotion();
      const promoData = Array.isArray(data) ? data : [];
      setPromotions(promoData);
      setFilteredPromotions(promoData);
    } catch (error) {
      console.error("Lỗi khi tải khuyến mãi:", error);
      setPromotions([]);
      setFilteredPromotions([]);
      toast.error("Không thể tải danh sách khuyến mãi!");
    }
  };

  const handleSearch = () => {
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

  const handleOpenDialogOptions = () => {
    setFormData({
      point: "",
      discount: "",
    });

    setOpenDialogOptions(true);
  };
  const handleCloseDialogOptions = () => {
    setOpenDialogOptions(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
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

    if (formData.description && formData.description.length < 5) {
      toast.error("Mô tả (nếu có) phải có ít nhất 5 ký tự!");
      return false;
    }

    const discount = Number(formData.discount_percentage);
    if (formData.discount_percentage === "") {
      toast.error("Phần trăm giảm giá không được để trống!");
      return false;
    }
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("Phần trăm giảm giá phải là số từ 0 đến 100!");
      return false;
    }

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

  const handleSubmitOptions = async () => {
    if (!formData.point || !formData.discount) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (formData.point < 0 || formData.discount < 0) {
      toast.error("Số điểm và phần trăm giảm không được âm!");
      return;
    }
    if (formData.discount > 100) {
      toast.error("Phần trăm giảm không được lớn hơn 100!");
      return;
    }
    if (formData.point > 9999999) {
      toast.error("Số điểm không được lớn hơn 999999!");
      return;
    }
    const promoData = {
      point: Number(formData.point),
      discount: Number(formData.discount),
    };
    try {
      await managementPromotionService.createPromotion(promoData);
      toast.success("Tạo mốc đổi điểm thành công!");
      fetchPromotionOptions();
      handleCloseDialogOptions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể lưu mốc đổi điểm!",
      );
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

  const handleUpdateOptions = async (id) => {
    setEditingId(id);
    const promo = promotionOptions.find((promo) => promo._id === id);
    setFormData({
      point: promo.point || "",
      discount: promo.discount || "",
    });
    setOpenDialogOptions(true);
  };

  const handleUpdate = async () => {
    if (formData.point < 0 || formData.discount < 0) {
      toast.error("Số điểm và phần trăm giảm không được âm!");
      return;
    }
    if (formData.discount > 100) {
      toast.error("Phần trăm giảm không được lớn hơn 100!");
      return;
    }
    if (formData.point > 9999999) {
      toast.error("Số điểm không được lớn hơn 999999!");
      return;
    }

    const promoData = {
      point: Number(formData.point),
      discount: Number(formData.discount),
    };

    try {
      await managementPromotionService.updatePromotion(editingId, promoData);
      setFormData({
        point: "",
        discount: "",
      });
      toast.success("Cập nhật mốc đổi điểm thành công!");
      fetchPromotionOptions();
      handleCloseDialogOptions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật mốc đổi điểm!",
      );
    }
  };

  const handleDeleteOptions = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mốc đổi điểm này?")) {
      try {
        toast.info("Đang xóa mốc đổi điểm...");
        const result = await managementPromotionService.deletePromotion(id);
        toast.success(result.message || "Xóa mốc đổi điểm thành công!");
        fetchPromotionOptions();
      } catch (error) {
        toast.error("Lỗi khi xóa mốc đổi điểm: " + error.message);
      }
    }
  };
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", p: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 3 }}
        >
          Quản Lý Khuyến Mãi
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

        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#1e293b", mb: 2 }}
          >
            Danh Sách Khuyến Mãi
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
              mb: 2,
            }}
            onClick={() => handleOpenDialogOptions()}
          >
            Thêm Mốc Đổi Điểm
          </Button>

          <TableContainer sx={{ mt: 2, borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#3b82f6" }}>
                  {["Số điểm", "Phần trăm giảm (%)", "Hành động"].map(
                    (header) => (
                      <TableCell
                        align="center"
                        key={header}
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {promotionOptions.map((promo) => (
                  <TableRow key={promo._id}>
                    <TableCell align="center">{promo.point}</TableCell>
                    <TableCell align="center">{promo.discount}%</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleUpdateOptions(promo._id)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteOptions(promo._id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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

        <Dialog
          open={openDialogOptionsOptions}
          onClose={handleCloseDialogOptions}
          maxWidth="sm"
        >
          <DialogTitle>Tạo mốc đổi điểm</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Số điểm"
              name="point"
              type="number"
              value={formData.point || ""}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Phần trăm giảm (%)"
              name="discount"
              type="number"
              value={formData.discount || ""}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogOptions} color="primary">
              Hủy
            </Button>
            {editingId ? (
              <Button
                onClick={() => handleUpdate(editingId)}
                variant="contained"
                sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                Cập Nhật
              </Button>
            ) : (
              <Button
                onClick={handleSubmitOptions}
                variant="contained"
                sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                Thêm
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default PromotionManagement;
