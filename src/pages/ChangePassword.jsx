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
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

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
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
        p: { xs: 2, sm: 0 }, // Padding responsive cho mobile
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 3,
          bgcolor: "white",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Tiêu đề */}
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 3,
            color: "primary.main",
            letterSpacing: "0.5px",
          }}
        >
          Đổi Mật Khẩu
        </Typography>

        {/* Trường nhập mật khẩu cũ */}
        <TextField
          label="Mật khẩu cũ"
          type={showPassword.old ? "text" : "password"}
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "grey.500" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, old: !prev.old }))
                  }
                  edge="end"
                >
                  {showPassword.old ? (
                    <VisibilityOff sx={{ color: "grey.500" }} />
                  ) : (
                    <Visibility sx={{ color: "grey.500" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Trường nhập mật khẩu mới */}
        <TextField
          label="Mật khẩu mới"
          type={showPassword.new ? "text" : "password"}
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "grey.500" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                  }
                  edge="end"
                >
                  {showPassword.new ? (
                    <VisibilityOff sx={{ color: "grey.500" }} />
                  ) : (
                    <Visibility sx={{ color: "grey.500" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Trường xác nhận mật khẩu mới */}
        <TextField
          label="Xác nhận mật khẩu mới"
          type={showPassword.confirm ? "text" : "password"}
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "grey.500" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  edge="end"
                >
                  {showPassword.confirm ? (
                    <VisibilityOff sx={{ color: "grey.500" }} />
                  ) : (
                    <Visibility sx={{ color: "grey.500" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        {/* Nút đổi mật khẩu */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.3s ease",
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
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
};

export default ChangePassword;
