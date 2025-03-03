import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
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
import {
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../services/adminService/promoService";

const PromoList = () => {
  const [promotions, setPromotions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromoId, setCurrentPromoId] = useState(null);
  const [newPromo, setNewPromo] = useState({
    name: "",
    code: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPromotion();
        setPromotions(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
      }
    };

    fetchPromotions();
  }, []);

  const handleSavePromo = async () => {
    if (
      !newPromo.name ||
      !newPromo.code ||
      !newPromo.description ||
      !newPromo.discount_percentage ||
      !newPromo.start_date ||
      !newPromo.end_date
    ) {
      alert("Vui lòng nhập đầy đủ thông tin khuyến mãi!");
      return;
    }

    const promoData = {
      ...newPromo,
      discount_percentage: Number(newPromo.discount_percentage),
      start_date: new Date(newPromo.start_date).toISOString(),
      end_date: new Date(newPromo.end_date).toISOString(),
    };

    try {
      if (editMode) {
        await updatePromotion(currentPromoId, promoData);
        setPromotions(
          promotions.map((promo) =>
            promo._id === currentPromoId ? { ...promo, ...promoData } : promo,
          ),
        );
      } else {
        const createdPromo = await createPromotion(promoData);
        setPromotions([...promotions, createdPromo]);
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Lỗi khi lưu khuyến mãi:", error);
    }
  };

  const handleDeletePromo = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await deletePromotion(id);
        setPromotions(promotions.filter((promo) => promo._id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
      }
    }
  };

  const handleEditPromo = (promo) => {
    setNewPromo({
      ...promo,
      discount_percentage: promo.discount_percentage.toString(),
    });
    setCurrentPromoId(promo._id);
    setEditMode(true);
    setOpen(true);
  };

  const resetForm = () => {
    setNewPromo({
      name: "",
      code: "",
      description: "",
      discount_percentage: "",
      start_date: "",
      end_date: "",
    });
    setEditMode(false);
    setCurrentPromoId(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý Khuyến mãi
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
          resetForm();
        }}
      >
        Thêm Khuyến mãi
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giảm giá (%)</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <TableRow key={promo._id}>
                  <TableCell>{promo._id}</TableCell>
                  <TableCell>{promo.name}</TableCell>
                  <TableCell>{promo.code}</TableCell>
                  <TableCell>{promo.description}</TableCell>
                  <TableCell>{promo.discount_percentage}%</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEditPromo(promo)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePromo(promo._id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có khuyến mãi nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editMode ? "Chỉnh sửa Khuyến mãi" : "Thêm Khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên"
            fullWidth
            value={newPromo.name}
            onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mã"
            fullWidth
            value={newPromo.code}
            onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={newPromo.description}
            onChange={(e) =>
              setNewPromo({ ...newPromo, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Giảm giá (%)"
            fullWidth
            type="number"
            value={newPromo.discount_percentage}
            onChange={(e) =>
              setNewPromo({ ...newPromo, discount_percentage: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Ngày bắt đầu"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromo.start_date}
            onChange={(e) =>
              setNewPromo({ ...newPromo, start_date: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Ngày kết thúc"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromo.end_date}
            onChange={(e) =>
              setNewPromo({ ...newPromo, end_date: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSavePromo} color="primary">
            {editMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default PromoList;
