import { useEffect, useState } from "react";
import productService from "../../services/productService";
import { toast } from "react-toastify";
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
  Pagination,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialPage = parseInt(queryParams.get("page")) || 1;
  const initialCategory = queryParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [limit] = useState(10);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAllProduct({
          page,
          limit,
          category: selectedCategory,
        });
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch products",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page, limit]);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await productService.getAllCategory();
        setCategories(response.data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch categories",
        );
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("page", page);
    if (selectedCategory) newParams.set("category", selectedCategory);

    navigate(`?${newParams.toString()}`, { replace: true });
  }, [page, selectedCategory, navigate]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🛍️ Product Management
        </Typography>
      </Box>

      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        displayEmpty
        sx={{
          marginBottom: 2,
          backgroundColor: "white",
          borderRadius: 2,
          minWidth: 150,
        }}
      >
        <MenuItem value="">All Products</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat._id} value={cat._id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>

      {loading ? (
        <Typography align="center" sx={{ color: "gray" }}>
          Loading products...
        </Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Discount (%)",
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
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell align="center">
                        <Avatar src={product.image} alt={product.name} />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="center">
                        {product?.category?.name}
                      </TableCell>
                      <TableCell align="center">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{product.stock}</TableCell>
                      <TableCell align="center">
                        {product.discountPercentage}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ color: "gray" }}
                    >
                      No products available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProductManagement;
