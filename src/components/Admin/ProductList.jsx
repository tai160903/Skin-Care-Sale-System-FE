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
} from "@mui/material";

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
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
      >
        Quản lý sản phẩm
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 1 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              {[
                "Hình ảnh",
                "Tên",
                "Danh mục",
                "Giảm giá",
                "Loại da",
                "Kho",
                "Giá",
                "Đánh giá",
                "Lượt mua",
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
            {products.map((product, index) => (
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
    </Box>
  );
};

export default ProductManager;
