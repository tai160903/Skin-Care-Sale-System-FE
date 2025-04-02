import { useEffect, useState } from "react";
import productService from "../../services/productService";
import skintypeService from "../../services/adminService/skinTypeService";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
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
  Button,
  Avatar,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import UploadImage from "../UploadImage";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialPage = parseInt(queryParams.get("page")) || 1;
  const initialCategory = queryParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    skinType: "",
    ingredient: "",
    description: "",
    userManual: "",
    weight: "",
    virtue: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchSkinTypes();
    fetchCategories();
  }, []); // Initial fetch only

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("page", page);
    if (selectedCategory) newParams.set("category", selectedCategory);
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [page, selectedCategory, navigate]);

  // Fetch products when searchQuery changes
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, page, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        category: selectedCategory || undefined,
        q: searchQuery || undefined,
      };
      const response = await productService.getAllProducts(params);
      if (response?.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkinTypes = async () => {
    try {
      const response = await skintypeService.getSkinTypes();
      setSkinTypes(response.data);
    } catch (error) {
      toast.error("Failed to fetch skin types", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories", error);
    }
  };

  const handleOpenConfirmDialog = (product) => {
    setSelectedProduct(product);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDisable = async () => {
    if (!selectedProduct) return;
    try {
      await productService.updateProduct(selectedProduct._id, {
        isDisabled: !selectedProduct.isDisabled,
      });
      toast.success(
        `Product ${selectedProduct.isDisabled ? "enabled" : "disabled"} successfully!`,
      );
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product status", error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || newProduct.name.trim() === "") {
      toast.error("Tên sản phẩm không được để trống!");
      return;
    }
    if (
      !newProduct.price ||
      isNaN(newProduct.price) ||
      Number(newProduct.price) <= 0
    ) {
      toast.error("Giá sản phẩm phải là số và lớn hơn 0!");
      return;
    }
    if (!newProduct.category) {
      toast.error("Vui lòng chọn danh mục!");
      return;
    }
    if (!newProduct.image) {
      toast.error("Vui lòng tải lên hình ảnh sản phẩm!");
      return;
    }
    try {
      await productService.createProduct(newProduct);
      toast.success("Product created successfully!");
      setOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to create product: " + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.name || editingProduct.name.trim() === "") {
      toast.error("Tên sản phẩm không được để trống!");
      return;
    }
    if (
      !editingProduct.price ||
      isNaN(editingProduct.price) ||
      Number(editingProduct.price) <= 0
    ) {
      toast.error("Giá sản phẩm phải là số và lớn hơn 0!");
      return;
    }
    if (!editingProduct.category) {
      toast.error("Vui lòng chọn danh mục!");
      return;
    }
    if (!editingProduct.image) {
      toast.error("Vui lòng tải lên hình ảnh sản phẩm!");
      return;
    }
    try {
      await productService.updateProduct(editingProduct._id, editingProduct);
      toast.success("Product updated successfully!");
      setOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product: " + error.message);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    // fetchProducts is triggered by useEffect when searchQuery changes
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🛍️ Product Management
        </Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={fetchProducts}>
            Refresh Products
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 2 }}
            onClick={() => setOpen(true)}
          >
            Create Product
          </Button>
        </Box>
      </Box>

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
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton onClick={handleSearch}>
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
        <Typography align="center" sx={{ color: "gray" }}>
          Loading products...
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 1 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                {[
                  "Hình Ảnh",
                  "Tên",
                  "Loại",
                  "Loại Da",
                  "Giá",
                  "Kho",
                  "Giảm Giá (%)",
                  "Actions",
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
                      {product.category.name}
                    </TableCell>
                    <TableCell align="center">
                      {product?.skinType?.VNname}
                    </TableCell>
                    <TableCell align="center">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">{product.stock}</TableCell>
                    <TableCell align="center">
                      {product.discountPercentage}%
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1.5}>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color={product.isDisabled ? "success" : "error"}
                          onClick={() => handleOpenConfirmDialog(product)}
                        >
                          {product.isDisabled ? "Enable" : "Disable"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: "gray" }}>
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {editingProduct ? "Chỉnh Sửa Sản Phẩm" : "Tạo Sản Phẩm"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.keys(newProduct).map((key) =>
              key === "skinType" || key === "category" ? (
                <FormControl fullWidth key={key}>
                  <InputLabel>
                    {key === "skinType" ? "Skin Type" : "Category"}
                  </InputLabel>
                  <Select
                    value={
                      (editingProduct
                        ? editingProduct[key]
                        : newProduct[key]) || ""
                    }
                    onChange={(e) => {
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            [key]: e.target.value,
                          })
                        : setNewProduct({
                            ...newProduct,
                            [key]: e.target.value,
                          });
                    }}
                  >
                    {(key === "skinType" ? skinTypes : categories).map(
                      (item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.VNname || item.name}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              ) : (
                key !== "image" && (
                  <TextField
                    key={key}
                    label={key}
                    fullWidth
                    value={
                      (editingProduct
                        ? editingProduct[key]
                        : newProduct[key]) || ""
                    }
                    onChange={(e) => {
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            [key]: e.target.value,
                          })
                        : setNewProduct({
                            ...newProduct,
                            [key]: e.target.value,
                          });
                    }}
                  />
                )
              ),
            )}
            <UploadImage
              onUploadSuccess={(url) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, image: url });
                } else {
                  setNewProduct({ ...newProduct, image: url });
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", gap: 2, paddingBottom: 2 }}
        >
          <Button
            onClick={() => setOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
            color="primary"
            variant="contained"
          >
            {editingProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {selectedProduct?.isDisabled ? "enable" : "disable"} this product:{" "}
            <strong>{selectedProduct?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDisable}
            color={selectedProduct?.isDisabled ? "success" : "error"}
            variant="contained"
          >
            {selectedProduct?.isDisabled ? "Enable" : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Paper>
  );
};

export default ProductList;
