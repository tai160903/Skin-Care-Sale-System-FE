import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  CardMedia,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";

const ReturnProductList = () => { // Lấy customerId từ URL
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { customerId } = useParams();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/restore/customer/${customerId}`
        );
        console.log("data:", response.data.data);
        setRequests(response.data.data); // Giả sử API trả về danh sách yêu cầu
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [customerId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
        Danh Sách Yêu Cầu Trả Sản Phẩm Của Bạn
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {requests.length > 0 ? (
        requests.map((req, index) => (
          <Card
            key={index}
            sx={{
              mb: 2,
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              p: 2,
              width: "100%",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: 1,
              }}
              image={req.image || "https://via.placeholder.com/150"}
              alt={req.product}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {req.product_id.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Lý do:</strong> {req.reason}
              </Typography>
              <Box sx={{ mt: 1 }}>
              <Chip
                label={{
                  Pending: "Chờ xử lý",
                  Accepted: "Đã chấp nhận",
                  Reject: "Bị từ chối",
                }[req.restore_status] || "Không xác định"}
                color={
                  req.restore_status === "Accepted"
                    ? "success"
                    : req.restore_status === "Reject"
                    ? "error"
                    : "warning"
                }
              />
            </Box>
            {req.restore_status !== "Pending" && req.staff_respone && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontStyle: "italic",
                  fontWeight: "bold",
                  color: req.restore_status === "Accepted" ? "green" : "red",
                  backgroundColor:
                    req.restore_status === "Accepted" ? "#e0f7fa" : "#ffebee",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <strong>Phản hồi:</strong> {req.staff_respone}
              </Typography>
            )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography textAlign="center" color="text.secondary">
          Không có yêu cầu nào.
        </Typography>
      )}
    </Container>
  );
};

export default ReturnProductList;
