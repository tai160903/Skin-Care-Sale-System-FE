import { useEffect, useState } from "react";
import userService from "../../services/userService";
import { 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Dialog, 
  DialogActions, DialogContent, DialogTitle 
} from "@mui/material";

const User = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const customers = await userService.getCustomers();
      const staffs = await userService.getStaffs();

      if (!Array.isArray(customers) || !Array.isArray(staffs)) {
        console.error("API không trả về mảng hợp lệ", { customers, staffs });
        setUsers([]);
        return;
      }

      setUsers([...customers, ...staffs]);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setUsers([]);
    }
  };

  const handleOpen = (user) => {
    setFormData({ id: user.id, fullName: user.fullName, email: user.email, role: user.role });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await userService.updateUser(formData.id, formData);
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách người dùng</h2>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpen(user)} style={{ marginRight: 10 }}>
                    Sửa
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(user.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa thông tin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField label="Họ và Tên" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Hủy</Button>
          <Button onClick={handleSubmit} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default User;
