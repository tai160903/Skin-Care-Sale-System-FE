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

  const validateInputs = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return "Vui lòng nhập đầy đủ thông tin!";
    }

    if (newPassword !== confirmNewPassword) {
      return "Mật khẩu mới và xác nhận mật khẩu không khớp!";
    }

    // Regex kiểm tra mật khẩu mạnh
    // const strongPasswordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // if (!strongPasswordRegex.test(newPassword)) {
    //   return "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!";
    // }

    return null;
  };

  const handleChangePassword = async () => {
    const validationError = validateInputs();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password-by-old-password",
        { userId, oldPassword, newPassword, confirmNewPassword },
      );

      if (response.data.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Đổi mật khẩu thất bại! Vui lòng thử lại.";
      toast.error(errorMessage);
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
        p: { xs: 2, sm: 0 },
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
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 3, color: "primary.main", letterSpacing: "0.5px" }}
        >
          Đổi Mật Khẩu
        </Typography>

        {/* Mật khẩu cũ */}
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
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />

        {/* Mật khẩu mới */}
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
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />

        {/* Xác nhận mật khẩu mới */}
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
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />

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
