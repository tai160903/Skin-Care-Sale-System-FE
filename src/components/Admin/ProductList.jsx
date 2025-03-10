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
  Avatar,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

const products = [
  {
    name: "Serum Vitamin C",
    ingredient: "Vitamin C, Hyaluronic Acid",
    category: "Skincare",
    discountPercentage: 20,
    skinType: "All",
    stock: 50,
    image: "https://via.placeholder.com/50",
    rating: 4.5,
    purchaseCount: 200,
    description: "Brightens and hydrates skin",
    isDisabled: false,
    price: 25,
  },
  {
    name: "Moisturizing Cream",
    ingredient: "Aloe Vera, Shea Butter",
    category: "Skincare",
    discountPercentage: 15,
    skinType: "Dry",
    stock: 30,
    image: "https://via.placeholder.com/50",
    rating: 4.7,
    purchaseCount: 150,
    description: "Deeply nourishes dry skin",
    isDisabled: false,
    price: 30,
  },
  {
    name: "Sunscreen SPF 50",
    ingredient: "Zinc Oxide, Vitamin E",
    category: "Suncare",
    discountPercentage: 10,
    skinType: "All",
    stock: 40,
    image: "https://via.placeholder.com/50",
    rating: 4.8,
    purchaseCount: 300,
    description: "Broad spectrum sun protection",
    isDisabled: false,
    price: 20,
  },
];

const ProductManager = () => {
  const [category, setCategory] = useState("All");

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🛍️ Product Management
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 2 }}
        >
          <MenuItem value="All">All Categories</MenuItem>
          <MenuItem value="Skincare">Skincare</MenuItem>
          <MenuItem value="Suncare">Suncare</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCategory("All")}
        >
          Reset Filter
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              {[
                "Image",
                "Name",
                "Category",
                "Discount",
                "Skin Type",
                "Stock",
                "Price",
                "Rating",
                "Purchases",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell align="center">
                  <Avatar src={product.image} alt={product.name} />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell align="center">{product.category}</TableCell>
                <TableCell align="center">
                  {product.discountPercentage}%
                </TableCell>
                <TableCell align="center">{product.skinType}</TableCell>
                <TableCell align="center">{product.stock}</TableCell>
                <TableCell align="center">${product.price}</TableCell>
                <TableCell align="center">{product.rating} ⭐</TableCell>
                <TableCell align="center">{product.purchaseCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ProductManager;
