import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination, // Thay TablePagination bằng Pagination
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axiosClient from "../../services/api.config";
import { toast } from "react-toastify";

// Custom styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxWidth: 1000,
  margin: "0 auto",
  borderRadius: 12,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    transition: "background-color 0.2s",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: "8px 14px",
    borderRadius: 8,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "10px 24px",
  textTransform: "none",
  fontWeight: 600,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 12,
    padding: theme.spacing(2),
    minWidth: 400,
  },
}));

// Tùy chỉnh Pagination
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPagination-ul": {
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  "& .MuiPaginationItem-root": {
    fontWeight: 500,
    color: "#2c3e50",
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    backgroundColor: "#1976d2",
    color: "white",
    "&:hover": {
      backgroundColor: "#115293",
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
}));

const RestoreComponent = ({ onRestore }) => {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [reason, setReason] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [page, setPage] = useState(1); // Pagination của MUI bắt đầu từ 1
  const [rowsPerPage] = useState(5); // Số hàng mỗi trang

  useEffect(() => {
    fetchAllRestore();
  }, []);

  const fetchAllRestore = async () => {
    try {
      const response = await axiosClient.get("/api/restore");
      setData(response.data.data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu!", error);
    }
  };

  const handleStatusChange = (id, status) => {
    setSelectedItemId(id);
    setNewStatus(status);
    setReason("");
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (selectedItemId) {
      try {
        await axiosClient.put(`/api/restore/${selectedItemId}`, {
          status: newStatus,
          response: reason,
        });

        setData((prevData) =>
          prevData.map((item) =>
            item._id === selectedItemId
              ? { ...item, restore_status: newStatus }
              : item,
          ),
        );

        toast.success("Cập nhật thành công!");
        setOpenDialog(false);
      } catch (error) {
        console.error("Cập nhật thất bại!", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Cập nhật thất bại!");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItemId(null);
    setReason("");
    setNewStatus("");
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage, // Pagination của MUI bắt đầu từ 1, nên cần trừ 1
    (page - 1) * rowsPerPage + rowsPerPage,
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div style={{ padding: "40px 20px", backgroundColor: "#f8f9fa" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#2c3e50",
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        Danh Sách Hoàn Trả
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#34495e" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Ảnh
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Sản phẩm
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Lý do
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <StyledTableRow key={item._id}>
                <TableCell>
                  <Avatar
                    src={item.image}
                    sx={{
                      width: 60,
                      height: 60,
                      border: "2px solid #3498db",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#2c3e50" }}>
                  {item.product_id?.name}
                </TableCell>
                <TableCell sx={{ color: "#7f8c8d" }}>{item.reason}</TableCell>
                <TableCell>
                  <StyledSelect
                    value={item.restore_status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    sx={{
                      fontWeight: "bold",
                      color:
                        item.restore_status === "Reject"
                          ? "#e74c3c"
                          : item.restore_status === "Approved"
                            ? "#2ecc71"
                            : "#f39c12",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <MenuItem value="Pending">⏳ Chờ xử lý</MenuItem>
                    <MenuItem value="Accepted">✅ Chấp nhận</MenuItem>
                    <MenuItem value="Reject">❌ Từ chối</MenuItem>
                  </StyledSelect>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Thêm Pagination */}
      <StyledPagination
        count={totalPages} // Tổng số trang
        page={page} // Trang hiện tại
        onChange={handleChangePage} // Xử lý khi đổi trang
        siblingCount={2} // Số trang hiển thị bên cạnh trang hiện tại
        boundaryCount={1} // Số trang hiển thị ở đầu và cuối
        showFirstButton={false} // Ẩn nút "First"
        showLastButton={false} // Ẩn nút "Last"
      />

      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: "#2c3e50", fontWeight: 600 }}>
          Cập Nhật Trạng Thái
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseDialog} color="inherit">
            Hủy
          </StyledButton>
          <StyledButton
            onClick={handleSave}
            color="primary"
            variant="contained"
          >
            Lưu
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </div>
  );
};

export default RestoreComponent;
