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
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProduct();
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
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

  const handleCreateProduct = async () => {
    try {
      await productService.createProduct(newProduct);
      toast.success("Product created successfully!");
      setOpen(false);
      fetchProducts(); // Refresh danh sách sản phẩm
    } catch (error) {
      toast.error("Failed to create product");
    }
  };


  // fake skintypes
  const mockSkinTypes = [
    { _id: "1", name: "Dry" },
    { _id: "2", name: "Oily" },
    { _id: "3", name: "Combination" },
    { _id: "4", name: "Sensitive" },
    { _id: "5", name: "Normal" }
  ];
  
  const [skinTypes, setSkinTypes] = useState([]);
  
  useEffect(() => {
    // Giả lập API call bằng setTimeout
    setTimeout(() => {
      setSkinTypes(mockSkinTypes);
    }, 500);
  }, []);



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
                {["Image", "Name", "Category", "Price", "Stock", "Discount (%)"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
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
                    sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell align="center">
                      <Avatar src={product.image} alt={product.name} />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="center">{product.category}</TableCell>
                    <TableCell align="center">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="center">{product.stock}</TableCell>
                    <TableCell align="center">{product.discountPercentage}%</TableCell>
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
  <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
    Create New Product
  </DialogTitle>
  <DialogContent>
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="Name" fullWidth value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

      <TextField label="Category" fullWidth value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />

      {/* Dropdown chọn Skin Type */}
      <FormControl fullWidth>
        <InputLabel>Skin Type</InputLabel>
        <Select
          value={newProduct.skinType || ""}
          onChange={(e) => setNewProduct({ ...newProduct, skinType: e.target.value })}
        >
          {skinTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField label="Ingredient" fullWidth value={newProduct.ingredient || ""}
        onChange={(e) => setNewProduct({ ...newProduct, ingredient: e.target.value })} />

      <Box display="flex" gap={2}>
        <TextField label="Price" type="number" fullWidth value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
        <TextField label="Stock" type="number" fullWidth value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
      </Box>

      <TextField label="Description" fullWidth value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />

      <TextField label="UserManual" fullWidth value={newProduct.userManual}
        onChange={(e) => setNewProduct({ ...newProduct, userManual: e.target.value })} />

      <TextField label="Virtuel" fullWidth value={newProduct.vvirtuel}
        onChange={(e) => setNewProduct({ ...newProduct, virtuel: e.target.value })} />

      {/* Upload Image */}
      <UploadImage onUploadSuccess={(url) => setNewProduct({ ...newProduct, image: url })} />

      {/* Hiển thị ảnh sau khi upload */}
      {newProduct.image && (
        <Box display="flex" justifyContent="center">
          <img src={newProduct.image} alt="Uploaded" 
            style={{ width: "120px", borderRadius: "10px", border: "1px solid #ccc", padding: "5px" }} />
        </Box>
      )}
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", gap: 2, paddingBottom: 2 }}>
    <Button onClick={() => setOpen(false)} color="secondary" variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleCreateProduct} color="primary" variant="contained">
      Create
    </Button>
  </DialogActions>
</Dialog>

    
    </Paper>
  );
};

export default ProductList;
