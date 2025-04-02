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
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosClient from "../../services/api.config";
import { toast } from "react-toastify";

const RestoreComponent = ({ onRestore }) => {
  const [data, setData] = useState([]);
  const [reasons, setReasons] = useState({});

  useEffect(() => {
    fetchAllRestore();
  }, []);

  const fetchAllRestore = async () => {
    try {
      const response = await axiosClient.get("/api/restore");
      setData(response.data.data);
      // Khởi tạo lý do cho tất cả các mục
      const initialReasons = {};
      response.data.data.forEach((item) => {
        initialReasons[item._id] = item.staff_respone || "";
      });
      setReasons(initialReasons);
    } catch (error) {
      toast.error("Không thể tải dữ liệu!", error);
    }
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, restore_status: newStatus } : item,
      ),
    );
  };

  // Xử lý nhập lý do
  const handleReasonChange = (id, reason) => {
    setReasons((prev) => ({ ...prev, [id]: reason }));
  };

  // Lưu trạng thái và lý do
  const handleSave = async (id) => {
    try {
      console.log(id);
      await axiosClient.put(`/api/restore/${id}`, {
        status: data.find((item) => item._id === id).restore_status,
        respone: reasons[id],
      });

      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Cập nhật thất bại!", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Danh sách hoàn trả
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 900, margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Ảnh</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Nhận xét</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Avatar src={item.image} sx={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{item.product_id?.name}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>
                  <Select
                    value={item.restore_status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    sx={{
                      fontWeight: "bold",
                      color:
                        item.restore_status === "Reject"
                          ? "red"
                          : item.restore_status === "Approved"
                            ? "green"
                            : "orange",
                    }}
                  >
                    <MenuItem value="Pending">⏳ Chờ xử lý</MenuItem>
                    <MenuItem value="Accepted">✅ Chấp nhận</MenuItem>
                    <MenuItem value="Reject">❌ Từ chối</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    placeholder="Nhập lý do..."
                    value={reasons[item._id]}
                    onChange={(e) =>
                      handleReasonChange(item._id, e.target.value)
                    }
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleSave(item._id)}
                  >
                    Lưu
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="secondary"
        sx={{ marginTop: 3 }}
        onClick={onRestore}
      >
        Khôi phục tất cả
      </Button>
    </div>
  );
};

export default RestoreComponent;
