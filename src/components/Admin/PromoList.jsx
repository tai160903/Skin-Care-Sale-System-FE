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
} from "@mui/material";
import { toast } from "react-toastify";

const PromoList = () => {
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

  useEffect(() => {
    let filtered = promotions || [];

    if (searchTerm) {
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
  }, [searchTerm, startDateFilter, endDateFilter, promotions]);

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
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!(formData.name || "").trim()) {
      toast.error("Tên khuyến mãi không được để trống!");
      return false;
    }
    if (!(formData.code || "").trim()) {
      toast.error("Mã khuyến mãi không được để trống!");
      return false;
    }
    if (
      formData.discount_percentage === "" ||
      formData.discount_percentage < 0 ||
      formData.discount_percentage > 100
    ) {
      toast.error("Phần trăm giảm giá phải từ 0 đến 100!");
      return false;
    }
    if (!formData.start_date) {
      toast.error("Ngày bắt đầu không được để trống!");
      return false;
    }
    if (!formData.end_date) {
      toast.error("Ngày kết thúc không được để trống!");
      return false;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc!");
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

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        const result = await deletePromotion(id);
        if (result.success) {
          toast.success(result.message);
          fetchPromotions();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Không thể xóa khuyến mãi!", error);
      }
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🎉 Quản lí Khuyến mãi
        </Typography>
      </Box>
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <TextField
          label="Tìm kiếm theo tên"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Bắt đầu từ"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          size="small"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
        />
        <TextField
          label="Kết thúc đến"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          size="small"
          value={endDateFilter}
          onChange={(e) => setEndDateFilter(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#0288d1",
          ":hover": { backgroundColor: "#0277bd", transform: "scale(1.05)" },
          transition: "0.3s ease-in-out",
          mb: 2,
        }}
        onClick={() => handleOpenDialog()}
      >
        Thêm Khuyến mãi
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tên
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mã
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mô tả
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Giảm giá (%)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Bắt đầu
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Kết thúc
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredPromotions || []).map((promo) => (
              <TableRow key={promo._id}>
                <TableCell>{promo.name || "Không có tên"}</TableCell>
                <TableCell>{promo.code || "Không có mã"}</TableCell>
                <TableCell>{promo.description || "Không có mô tả"}</TableCell>
                <TableCell>{promo.discount_percentage || 0}%</TableCell>
                <TableCell>
                  {promo.start_date
                    ? new Date(promo.start_date).toLocaleDateString()
                    : "Không xác định"}
                </TableCell>
                <TableCell>
                  {promo.end_date
                    ? new Date(promo.end_date).toLocaleDateString()
                    : "Không xác định"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDialog(promo)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(promo._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? "Sửa Khuyến mãi" : "Thêm Khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Tên"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 50 }}
            helperText={`${(formData.name || "").length}/50 ký tự`}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mã"
            name="code"
            value={formData.code || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
            helperText={`${(formData.code || "").length}/20 ký tự`}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mô tả"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            inputProps={{ maxLength: 200 }}
            helperText={`${(formData.description || "").length}/200 ký tự`}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Giảm giá (%)"
            name="discount_percentage"
            type="number"
            value={formData.discount_percentage || ""}
            onChange={handleChange}
            inputProps={{ min: 0, max: 100 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Ngày bắt đầu"
            name="start_date"
            type="date"
            value={formData.start_date || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Ngày kết thúc"
            name="end_date"
            type="date"
            value={formData.end_date || ""}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingId ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PromoList;
