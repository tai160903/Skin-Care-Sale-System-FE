import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const promotions = [
  {
    name: "Summer Sale",
    code: "SUMMER2024",
    description: "Giảm giá mùa hè",
    discount_percentage: 20,
    start_date: "2024-06-01",
    end_date: "2024-06-30",
  },
  {
    name: "Black Friday",
    code: "BLACKFRI",
    description: "Giảm giá lớn ngày Black Friday",
    discount_percentage: 50,
    start_date: "2024-11-25",
    end_date: "2024-11-30",
  },
  {
    name: "New Year",
    code: "NEWYEAR24",
    description: "Chào mừng năm mới",
    discount_percentage: 30,
    start_date: "2024-12-25",
    end_date: "2025-01-05",
  },
  {
    name: "Back to School",
    code: "SCHOOL25",
    description: "Khuyến mãi mùa tựu trường",
    discount_percentage: 15,
    start_date: "2024-08-01",
    end_date: "2024-09-01",
  },
  {
    name: "Holiday Sale",
    code: "HOLIDAY24",
    description: "Giảm giá dịp lễ",
    discount_percentage: 25,
    start_date: "2024-12-20",
    end_date: "2024-12-31",
  },
  {
    name: "Flash Sale",
    code: "FLASH123",
    description: "Giảm giá trong 24h",
    discount_percentage: 40,
    start_date: "2024-07-10",
    end_date: "2024-07-11",
  },
  {
    name: "Cyber Monday",
    code: "CYBER24",
    description: "Giảm giá ngày Cyber Monday",
    discount_percentage: 45,
    start_date: "2024-12-02",
    end_date: "2024-12-03",
  },
  {
    name: "Christmas Deals",
    code: "XMAS24",
    description: "Ưu đãi Giáng sinh",
    discount_percentage: 35,
    start_date: "2024-12-20",
    end_date: "2024-12-26",
  },
  {
    name: "Valentine Special",
    code: "LOVE2024",
    description: "Ưu đãi ngày Valentine",
    discount_percentage: 20,
    start_date: "2024-02-10",
    end_date: "2024-02-15",
  },
  {
    name: "Halloween Discount",
    code: "HALLOW24",
    description: "Giảm giá Halloween",
    discount_percentage: 30,
    start_date: "2024-10-25",
    end_date: "2024-10-31",
  },
];

const PromotionManager = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ marginBottom: 2, fontWeight: "bold" }}
      >
        Quản lý khuyến mãi
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tên
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mã
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Mô tả
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Giảm giá (%)
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ngày bắt đầu
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ngày kết thúc
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promo, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell>{promo.name}</TableCell>
                <TableCell>{promo.code}</TableCell>
                <TableCell>{promo.description}</TableCell>
                <TableCell>{promo.discount_percentage}%</TableCell>
                <TableCell>{promo.start_date}</TableCell>
                <TableCell>{promo.end_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PromotionManager;
