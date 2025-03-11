import { useEffect, useState } from "react";
import { getPromotion, createPromotion, updatePromotion, deletePromotion } from "../../services/adminService/promoService";
import { Button, Box,Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

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

  // Fetch promotions khi component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Gọi API lấy danh sách khuyến mãi
  const fetchPromotions = async () => {
    const data = await getPromotion();
    setPromotions(data);
    setFilteredPromotions(data);
  };

  // Xử lý tìm kiếm theo tên và lọc theo ngày
  useEffect(() => {
    let filtered = promotions;

    if (searchTerm) {
      filtered = filtered.filter((promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (promo) => new Date(promo.start_date) >= new Date(startDateFilter)
      );
    }

    if (endDateFilter) {
      filtered = filtered.filter(
        (promo) => new Date(promo.end_date) <= new Date(endDateFilter)
      );
    }

    setFilteredPromotions(filtered);
  }, [searchTerm, startDateFilter, endDateFilter, promotions]);

  // Xử lý mở dialog (Thêm/Sửa)
  const handleOpenDialog = (promotion = null) => {
    if (promotion) {
      setEditingId(promotion._id);
      setFormData({
        name: promotion.name,
        code: promotion.code,
        description: promotion.description,
        discount_percentage: promotion.discount_percentage,
        start_date: promotion.start_date.split("T")[0],
        end_date: promotion.end_date.split("T")[0],
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

  // Xử lý đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý submit form (Thêm/Sửa)
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updatePromotion(editingId, formData);
      } else {
        await createPromotion(formData);
      }
      fetchPromotions();
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu khuyến mãi:", error);
    }
  };

  // Xử lý xóa khuyến mãi
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      await deletePromotion(id);
      fetchPromotions();
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        🎉 Quản lí Khuyến mãi
        </Typography>
        </Box>
      {/* Ô tìm kiếm và bộ lọc */}
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
      }} onClick={() => handleOpenDialog()}>
        Thêm Khuyến mãi
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tên</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Mã</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Mô tả</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Giảm giá (%)</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Bắt đầu</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Kết thúc</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPromotions.map((promo) => (
              <TableRow key={promo._id}>
                <TableCell>{promo.name}</TableCell>
                <TableCell>{promo.code}</TableCell>
                <TableCell>{promo.description}</TableCell>
                <TableCell>{promo.discount_percentage}%</TableCell>
                <TableCell>{new Date(promo.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promo.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(promo)}>Sửa</Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(promo._id)} style={{ marginLeft: "10px" }}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingId ? "Sửa Khuyến mãi" : "Thêm Khuyến mãi"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Tên" name="name" value={formData.name} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Mã" name="code" value={formData.code} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Mô tả" name="description" value={formData.description} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Giảm giá (%)" name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Ngày bắt đầu" name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Ngày kết thúc" name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Hủy</Button>
          <Button onClick={handleSubmit} color="primary">{editingId ? "Cập nhật" : "Thêm"}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PromoList;
