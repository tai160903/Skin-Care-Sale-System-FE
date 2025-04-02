import { useEffect, useState } from "react";
import { getPromotion } from "../../services/adminService/promoService";
import { toast } from "react-toastify";
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
  Chip,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const PromoList = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await getPromotion();
      const promoData = Array.isArray(response) ? response : [];
      setPromotions(promoData);
      setFilteredPromotions(promoData); // Hiển thị tất cả khuyến mãi ban đầu
    } catch (error) {
      console.error("Lỗi khi tải khuyến mãi:", error);
      toast.error("Không thể tải danh sách khuyến mãi");
      setPromotions([]);
      setFilteredPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm
  const handleSearch = () => {
    const filtered = promotions.filter((promo) => {
      const promoStartDate = new Date(promo.start_date);
      const promoEndDate = new Date(promo.end_date);

      const matchesStartDate = startDate
        ? promoStartDate.toLocaleDateString() ===
          startDate.toDate().toLocaleDateString()
        : true;
      const matchesEndDate = endDate
        ? promoEndDate.toLocaleDateString() ===
          endDate.toDate().toLocaleDateString()
        : true;
      const matchesName = searchName
        ? promo.name.toLowerCase().includes(searchName.toLowerCase())
        : true;

      return matchesStartDate && matchesEndDate && matchesName;
    });
    setFilteredPromotions(filtered);
  };

  // Xóa tìm kiếm tên
  const handleClearSearchName = () => {
    setSearchName("");
    handleSearch(); // Tự động tìm kiếm lại sau khi xóa
  };

  // Xóa tất cả bộ lọc
  const handleClearAllFilters = () => {
    setSearchName("");
    setStartDate(null);
    setEndDate(null);
    setFilteredPromotions(promotions); // Hiển thị lại tất cả khuyến mãi
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      {/* Phần tiêu đề */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span role="img" aria-label="khuyến mãi" style={{ marginRight: 8 }}>
            🎉
          </span>
          Quản lý Khuyến mãi
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchPromotions}
          sx={{
            backgroundColor: "#0288d1",
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 16px",
            ":hover": {
              backgroundColor: "#0277bd",
              transform: "scale(1.03)",
            },
            transition: "all 0.3s ease-in-out",
          }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Phần bộ lọc/tìm kiếm */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <TextField
            label="Tìm kiếm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              flex: "1 1 300px",
              minWidth: 200,
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e0e0e0" },
                "&:hover fieldset": { borderColor: "#0288d1" },
                "&.Mui-focused fieldset": { borderColor: "#1976d2" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchName && (
                    <IconButton
                      onClick={handleClearSearchName}
                      size="small"
                      sx={{
                        color: "#757575",
                        "&:hover": { color: "#d32f2f" },
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={handleSearch}
                    sx={{
                      color: "#0288d1",
                      "&:hover": { color: "#1976d2" },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <DatePicker
            label="Ngày bắt đầu"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ flex: "1 1 200px", minWidth: 150 }}
            slotProps={{ textField: { variant: "outlined" } }}
          />
          <DatePicker
            label="Ngày kết thúc"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ flex: "1 1 200px", minWidth: 150 }}
            slotProps={{ textField: { variant: "outlined" } }}
          />
          <Button
            variant="outlined"
            color="secondary"
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
      </LocalizationProvider>

      {/* Phần bảng */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#1976d2",
                  "& th": { color: "#fff", fontWeight: 600 },
                }}
              >
                {[
                  "Tên",
                  "Mã",
                  "Mô tả",
                  "Giảm giá (%)",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Trạng thái",
                ].map((header) => (
                  <TableCell key={header} align="center">
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
                    sx={{
                      "&:hover": { bgcolor: "#e3f2fd" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell align="center">{promo.name}</TableCell>
                    <TableCell align="center">{promo.code}</TableCell>
                    <TableCell align="center">{promo.description}</TableCell>
                    <TableCell align="center">
                      {promo.discount_percentage}%
                    </TableCell>
                    <TableCell align="center">
                      {new Date(promo.start_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(promo.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          new Date(promo.end_date) > new Date()
                            ? "Đang hoạt động"
                            : "Hết hạn"
                        }
                        color={
                          new Date(promo.end_date) > new Date()
                            ? "success"
                            : "error"
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
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
                    Không tìm thấy chương trình khuyến mãi nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default PromoList;
