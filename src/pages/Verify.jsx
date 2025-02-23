import { useEffect, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import { toast } from "react-toastify";

function Verify() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang xác thực...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token && userId) {
      authService
        .verifyEmail(userId, token)
        .then(() => {
          setMessage("Xác thực thành công! Chuyển hướng sau 5 giây...");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate("/signin"), 5000);
        })
        .catch((error) => {
          setMessage("Xác thực thất bại. Vui lòng thử lại sau.");
          setSuccess(false);
          setLoading(false);
          toast.error(error.message);
        });
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Xác thực Email
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Alert severity={success ? "success" : "error"}>{message}</Alert>
      )}
    </Container>
  );
}

export default Verify;
