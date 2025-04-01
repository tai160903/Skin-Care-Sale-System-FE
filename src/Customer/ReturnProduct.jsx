import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

const ReturnProduct = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Return request submitted:", form);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" gutterBottom>
        Trả Sản Phẩm
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Họ và Tên"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          label="Lý do trả sản phẩm"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Gửi Yêu Cầu
        </Button>
      </form>
    </Container>
  );
};

export default ReturnProduct;
