import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Box,
} from "@mui/material";

const Settings = () => {
  // Trạng thái cho chế độ sáng/tối
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Hàm xử lý thay đổi chế độ sáng/tối
  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };

  // Hàm xử lý thay đổi thông tin người dùng
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "phone") {
      setPhone(value);
    }
  };

  // Hàm lưu cài đặt
  const handleSaveSettings = () => {
    // Thực hiện lưu các cài đặt (có thể gửi đến server hoặc lưu vào localStorage)
    console.log("Cài đặt đã được lưu:");
    console.log("Chế độ sáng/tối:", darkMode ? "Tối" : "Sáng");
    console.log("Email:", email);
    console.log("Số điện thoại:", phone);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cài Đặt
      </Typography>
      <Grid container spacing={3}>
        {/* Cài đặt chế độ sáng/tối */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Chế Độ Sáng/Tối</Typography>
          <FormControlLabel
            control={
              <Switch checked={darkMode} onChange={handleDarkModeChange} />
            }
            label={darkMode ? "Tối" : "Sáng"}
          />
        </Grid>

        {/* Cài đặt thông tin người dùng */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Thông Tin Cá Nhân</Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={email}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Số Điện Thoại"
            variant="outlined"
            fullWidth
            name="phone"
            value={phone}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {/* Cài đặt thông báo */}
        <Grid item xs={12}>
          <Typography variant="h6">Cài Đặt Thông Báo</Typography>
          <FormControlLabel control={<Switch />} label="Nhận Thông Báo Email" />
        </Grid>

        {/* Nút lưu cài đặt */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
            >
              Lưu Cài Đặt
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
