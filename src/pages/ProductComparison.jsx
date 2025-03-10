import { useSelector, useDispatch } from "react-redux";
import { removeFromCompare, addToCompare } from "../redux/slices/compareSlice";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";

function Compare() {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.compare?.compareList || []);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setAllProducts(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách sản phẩm.", error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleAddProductToCompare = (product) => {
    dispatch(addToCompare(product));
    toast.success("Đã thêm vào danh sách so sánh!");
    setOpenDialog(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">So sánh sản phẩm</h2>

      {compareList.length === 0 ? (
        <p className="text-gray-500">Chưa có sản phẩm nào để so sánh.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compareList.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <h3 className="text-lg font-bold mt-2">{product.name}</h3>
              <p className="text-red-500 font-bold">{product.price}đ</p>
              <Button
                variant="contained"
                color="error"
                startIcon={<FiTrash2 />}
                onClick={() => dispatch(removeFromCompare(product._id))}
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => setOpenDialog(true)}
        >
          Thêm sản phẩm vào so sánh
        </Button>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chọn sản phẩm để so sánh</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tìm kiếm sản phẩm..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allProducts
              .filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((product) => (
                <div key={product._id} className="border p-4 rounded-lg shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                  <p className="text-red-500 font-bold">{product.price}đ</p>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<FiPlus />}
                    onClick={() => handleAddProductToCompare(product)}
                  >
                    Thêm vào so sánh
                  </Button>
                </div>
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Compare;
