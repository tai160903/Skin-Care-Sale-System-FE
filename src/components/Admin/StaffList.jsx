import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Email,
  Lock,
  Search as SearchIcon,
  Visibility,
  VisibilityOff,
  People,
  VerifiedUser,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import userService from "../../services/userService";
import allUserService from "../../services/adminService/alluserService";

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ email: "", password: "" });
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch tất cả người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const customers = await userService.getCustomers();
        const staffs = await allUserService.getStaff();
        const combinedUsers = [
          ...(Array.isArray(customers) ? customers : []),
          ...(Array.isArray(staffs.data) ? staffs.data : []),
        ];
        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = users.filter(
      (user) =>
        (user.email || "").toLowerCase().includes(value) ||
        (user.role || "").toLowerCase().includes(value) ||
        (user.fullName || "").toLowerCase().includes(value),
    );
    setFilteredUsers(filtered);
  };

  // Xử lý input form thêm nhân viên
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Tạo nhân viên mới
  const handleCreateEmployee = async () => {
    try {
      const response = await userService.createEmployee(newEmployee);
      setUsers([...users, response]);
      setFilteredUsers([...users, response]);
      setSnackbarMessage("Nhân viên đã được thêm thành công!");
      setSnackbarSeverity("success");
      setNewEmployee({ email: "", password: "" });
    } catch (error) {
      setSnackbarMessage(
        "Lỗi khi thêm nhân viên: " + (error.message || "Không xác định"),
      );
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          <People sx={{ mr: 1, verticalAlign: "middle" }} /> Quản lý người dùng
        </Typography>
      </motion.div>

      {/* Form thêm nhân viên */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#1976d2" }}
        >
          Thêm nhân viên mới
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <TextField
            label="Email"
            name="email"
            value={newEmployee.email}
            onChange={handleInputChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#1565c0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={newEmployee.password}
            onChange={handleInputChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#1565c0" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateEmployee}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Thêm nhân viên
          </Button>
        </Box>
      </Paper>

      {/* Thanh tìm kiếm */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 3,
          paddingX: 2,
          boxShadow: 1,
          mb: 3,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <SearchIcon sx={{ color: "gray", mr: 1 }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder="Tìm kiếm theo email, vai trò hoặc tên..."
          value={search}
          onChange={handleSearch}
          InputProps={{ disableUnderline: true }}
        />
      </Box>

      {/* Danh sách người dùng */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#1976d2" }}
        >
          Danh sách người dùng
        </Typography>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            Không tìm thấy người dùng nào.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Avatar
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Tên
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Vai trò
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Trạng thái
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Ngày tạo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                  >
                    <TableCell>
                      <Avatar
                        src={user.avatar}
                        alt={user.fullName || user.email}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {user.fullName || "Không có tên"}
                    </TableCell>
                    <TableCell>{user.email || "Không có email"}</TableCell>
                    <TableCell sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                      {user.role || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Tooltip title="Bị cấm">
                          <Typography color="error" variant="body2">
                            Banned
                          </Typography>
                        </Tooltip>
                      ) : user.isVerify ? (
                        <Tooltip title="Đã xác minh">
                          <VerifiedUser sx={{ color: "green" }} />
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Chưa xác minh
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Không xác định"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StaffList;
