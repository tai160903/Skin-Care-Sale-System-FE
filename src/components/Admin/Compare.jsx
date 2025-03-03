import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 1200,
    rating: 4.8,
    brand: "Apple",
    weight: "180g",
  },
  {
    id: 2,
    name: "Samsung S23",
    price: 1100,
    rating: 4.6,
    brand: "Samsung",
    weight: "170g",
  },
  {
    id: 3,
    name: "Google Pixel 7",
    price: 900,
    rating: 4.7,
    brand: "Google",
    weight: "175g",
  },
  {
    id: 4,
    name: "OnePlus 11",
    price: 950,
    rating: 4.5,
    brand: "OnePlus",
    weight: "185g",
  },
];

const Compare = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectProduct = (event) => {
    const selectedId = event.target.value;
    if (
      selectedProducts.length < 3 &&
      !selectedProducts.find((p) => p.id === selectedId)
    ) {
      const product = products.find((p) => p.id === selectedId);
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        So sánh sản phẩm
      </Typography>

      {/* Dropdown chọn sản phẩm */}
      <Select value="" displayEmpty onChange={handleSelectProduct} fullWidth>
        <MenuItem value="" disabled>
          Chọn sản phẩm để so sánh
        </MenuItem>
        {products.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name}
          </MenuItem>
        ))}
      </Select>

      {/* Bảng so sánh */}
      {selectedProducts.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Thuộc tính</b>
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell key={product.id}>
                    {product.name}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>Giá</b>
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell key={product.id}>${product.price}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Đánh giá</b>
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell key={product.id}>{product.rating} ⭐</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Thương hiệu</b>
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell key={product.id}>{product.brand}</TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>Trọng lượng</b>
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell key={product.id}>{product.weight}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Biểu đồ giá */}
      {selectedProducts.length > 0 && (
        <Box mt={4} height={300}>
          <Typography variant="h6" gutterBottom>
            So sánh giá sản phẩm
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={selectedProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default Compare;
