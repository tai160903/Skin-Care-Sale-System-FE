import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const storedUser = localStorage.getItem("persist:user");
  const user = storedUser ? JSON.parse(storedUser)?.user : null;
  const userId = user ? JSON.parse(user)._id : null;

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password-by-old-password",
        { userId, oldPassword, newPassword, confirmNewPassword },
      );

      if (response.data.success) {
        toast.success("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error(response?.data?.message || "Lỗi khi kết nối đến server!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Đổi Mật Khẩu
        </Typography>

        <TextField
          label="Mật khẩu cũ"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
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

        <TextField
          label="Mật khẩu mới"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
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

        <TextField
          label="Xác nhận mật khẩu mới"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
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
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #42a5f5 30%, #1e88e5 90%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1e88e5 30%, #1565c0 90%)",
            },
          }}
          onClick={handleChangePassword}
        >
          Đổi Mật Khẩu
        </Button>
      </Paper>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
};

export default ChangePassword;
