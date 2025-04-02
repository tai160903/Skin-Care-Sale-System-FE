import { useState } from "react";
import { Container, Typography, Card, CardContent, Divider, CardMedia, Chip, Box } from "@mui/material";

const ReturnProductList = () => {
  const [requests, setRequests] = useState([
    { name: "Nguyễn Văn A", email: "a@gmail.com", product: "Sản phẩm A", reason: "Lỗi kỹ thuật", image: "https://i.scdn.co/image/ab67616d0000b2730ecdf596e76b0403506c1375", status: "Đang chờ xử lý", feedback: "" },
    { name: "Trần Thị B", email: "b@gmail.com", product: "Sản phẩm B", reason: "Không đúng mô tả", image: "https://via.placeholder.com/150", status: "Đã chấp nhận", feedback: "Sản phẩm được hoàn trả do lỗi từ nhà sản xuất." },
    { name: "Lê Văn C", email: "c@gmail.com", product: "Sản phẩm C", reason: "Không vừa ý", image: "https://via.placeholder.com/150", status: "Bị từ chối", feedback: "Không đủ điều kiện hoàn trả do sử dụng không đúng cách." }
  ]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
        Danh Sách Yêu Cầu Trả Sản Phẩm
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {requests.length > 0 ? (
        requests.map((req, index) => (
          <Card key={index} sx={{ mb: 2, boxShadow: 2, borderRadius: 2, display: "flex", alignItems: "center", p: 2, width: "100%" }}>
            <CardMedia
              component="img"
              sx={{ width: 200, height: 200, objectFit: "cover", borderRadius: 1 }}
              image={req.image}
              alt={req.product}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {req.product}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Lý do:</strong> {req.reason}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={req.status} 
                  color={req.status === "Đã chấp nhận" ? "success" : req.status === "Bị từ chối" ? "error" : "warning"} 
                />
              </Box>
              {req.status !== "Đang chờ xử lý" && req.feedback && (
                <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                fontStyle: "italic", 
                fontWeight: "bold", 
                color: req.status === "Đã chấp nhận" ? "green" : "red", 
                backgroundColor: req.status === "Đã chấp nhận" ? "#e0f7fa" : "#ffebee", 
                p: 1, 
                borderRadius: 1 
              }}
            >
              <strong>Phản hồi:</strong> {req.feedback}
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
