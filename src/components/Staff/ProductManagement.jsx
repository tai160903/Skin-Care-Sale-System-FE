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
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        category: selectedCategory || undefined,
        q: searchQuery || undefined,
        minPrice: 0,
        maxPrice: Infinity,
      };
      const response = await productService.getAllProducts(params);
      setProducts(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount or when page/category changes
  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await productService.getAllCategory();
        setCategories(response.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Không thể tải danh mục");
      }
    };
    getCategories();
  }, []);

  // Update URL params
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

  const handleSearch = () => {
    setPage(1); // Reset to first page on search
    fetchProducts(); // Fetch with current search value
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    fetchProducts(); // Fetch all products after clearing
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span role="img" aria-label="sản phẩm" style={{ marginRight: 8 }}>
            🛍️
          </span>
          Quản lý Sản phẩm
        </Typography>
      </Box>

      {/* Search and Category Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Tìm kiếm sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            flex: "1 1 300px",
            minWidth: 200,
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#0288d1" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton
                    onClick={handleClearSearch}
                    size="small"
                    sx={{
                      color: "#757575",
                      "&:hover": { color: "#d32f2f" },
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    color: "#0288d1",
                    "&:hover": { color: "#1976d2" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Danh mục"
            sx={{ backgroundColor: "white", borderRadius: 2 }}
          >
            <MenuItem value="">Tất cả sản phẩm</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography align="center" sx={{ color: "gray", py: 4 }}>
          Đang tải sản phẩm...
        </Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  {[
                    "Hình ảnh",
                    "Tên",
                    "Danh mục",
                    "Giá",
                    "Tồn kho",
                    "Giảm giá (%)",
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
                      key={product._id || index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        "&:hover": { backgroundColor: "#e0f7fa" },
                      }}
                    >
                      <TableCell align="center">
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="center">
                        {product?.category?.name || "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        ${product.price?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell align="center">{product.stock || 0}</TableCell>
                      <TableCell align="center">
                        {product.discountPercentage || 0}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ color: "gray", py: 4 }}
                    >
                      Không có sản phẩm nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
