import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Banner = () => {
  return (
    <Box
      sx={{
        bgcolor: "#326f51", // Giữ màu cũ
        color: "white",
        py: 0.5, // Giảm padding dọc từ 2 xuống 1.4 để chiều cao nhỏ hơn (khoảng 70% so với ban đầu)
        px: 10,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Phần 1: Logo hoặc Icon */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            animation: "pulse 2s infinite",
          }}
        >
          🌟
        </Typography>
      </Box>

      {/* Phần 2: Nội dung chính (Nhấp nháy) */}
      <Box
        sx={{
          animation: "blink 1.5s infinite",
          textAlign: "center",
          flexGrow: 1,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
            textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          Khám phá loại da của bạn ngay!
        </Typography>
      </Box>

      {/* Phần 3: Nút bấm */}
      <Box sx={{ flexShrink: 0 }}>
        <Button
          component={Link}
          to="/question"
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#15803d", // green-700
            px: 3, // Giữ nguyên padding ngang
            py: 0.1, // Giảm từ 1 xuống 0.6 để giảm chiều cao (khoảng 60% so với trước)
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": {
              bgcolor: "#e6ffe6", // green-50
              color: "#15803d",
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
            transition: "all 0.3s ease",
            fontSize: "0.9rem", // Giảm kích thước chữ để cân đối
          }}
        >
          Khám Phá
        </Button>
      </Box>
      {/* Định nghĩa CSS animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default Banner;
