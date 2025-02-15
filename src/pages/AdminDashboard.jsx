import React from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { MonetizationOn, ShoppingCart, People } from "@mui/icons-material";
import Sidebar from "../Admin/Sidebar";
import Navbar from "../Admin/Navbar";
import StatsCard from "../Admin/StatsCard";
import SalesChart from "../Admin/SalesChart";
import OrdersTable from "../Admin/OrdersTable";

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#f4f6f8",
        overflow: "auto", // Cho phép cuộn nội dung bên trong Box
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
        <Navbar />

        {/* Overview Statistics - Sử dụng Stack để căn chỉnh cân đối hơn */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <StatsCard
            title="Tổng Doanh Thu"
            value="$50,000"
            icon={<MonetizationOn sx={{ fontSize: 30, color: "#4caf50" }} />}
            sx={{
              bgcolor: "#e8f5e9",
              color: "#388e3c",
              p: 2,
              minWidth: 200,
              textAlign: "center",
              "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
            }}
          />
          <StatsCard
            title="Đơn Hàng Mới"
            value="120"
            icon={<ShoppingCart sx={{ fontSize: 30, color: "#ff9800" }} />}
            sx={{
              bgcolor: "#fff3e0",
              color: "#f57c00",
              p: 2,
              minWidth: 200,
              textAlign: "center",
              "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
            }}
          />
          <StatsCard
            title="Khách Hàng"
            value="3,500"
            icon={<People sx={{ fontSize: 30, color: "#2196f3" }} />}
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              p: 2,
              minWidth: 200,
              textAlign: "center",
              "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
            }}
          />
          <StatsCard
            title="Nhân Viên"
            value="30"
            icon={<People sx={{ fontSize: 30, color: "#2196f3" }} />}
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              p: 2,
              minWidth: 200,
              textAlign: "center",
              "&:hover": { transform: "scale(1.05)", transition: "0.3s" },
            }}
          />
        </Stack>

        {/* Revenue Chart */}
        <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            📊 Thống Kê Doanh Thu
          </Typography>
          <SalesChart />
        </Paper>

        {/* Orders Table */}
        <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            📋 Danh Sách Đơn Hàng
          </Typography>
          <OrdersTable />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
