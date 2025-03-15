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
} from "@mui/material";
import UploadImage from "../UploadImage";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [skinTypes, setSkinTypes] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    virtuel: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchSkinTypes();
  }, [page]);

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
      toast.error("Failed to update product status");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProduct({ page, limit });
      if (response?.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
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
      toast.error("Failed to fetch skin types");
    }
  };

  const handleCreateProduct = async () => {
    try {
      await productService.createProduct(newProduct);
      toast.success("Product created successfully!");
      setOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleDisableProduct = async (product) => {
    try {
      await productService.updateProduct(product._id, {
        isDisabled: !product.isDisabled,
      });
      toast.success(
        `Product ${product.isDisabled ? "enabled" : "disabled"} successfully!`,
      );
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleEditProduct = (product) => {
    console.log("product:", product);
    setEditingProduct(product);
    setOpen(true);
  };

  const handleUpdateProduct = async () => {
    try {
      await productService.updateProduct(editingProduct._id, editingProduct);
      toast.success("Product updated successfully!");
      setOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product");
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

      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: 2 }}
      >
        <MenuItem value="All">All Categories</MenuItem>
        <MenuItem value="Skincare">Skincare</MenuItem>
        <MenuItem value="Suncare">Suncare</MenuItem>
      </Select>
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
                  "Image",
                  "Name",
                  "Category",
                  "Price",
                  "Stock",
                  "Discount (%)",
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
                    <TableCell align="center">{product.category}</TableCell>
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
                          color={product.isDisabled ? "success" : "error"} // Enable = xanh, Disable = đỏ
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
                  <TableCell colSpan={6} align="center" sx={{ color: "gray" }}>
                    No products available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog tạo sản phẩm */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {editingProduct ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.keys(newProduct).map((key) =>
              key === "skinType" ? (
                <FormControl fullWidth key={key}>
                  <InputLabel>Skin Type</InputLabel>
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
                    {skinTypes.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
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
            color={selectedProduct?.isDisabled ? "success" : "error"} // Enable = xanh, Disable = đỏ
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
