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
import { useState, useEffect, useMemo } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";

function Compare() {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.compare?.compareList || []);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (openDialog) {
      const fetchAllProducts = async () => {
        try {
          console.log("🔄 Đang tải danh sách sản phẩm...");
          const response = await productService.getAllProducts();
          setAllProducts(response.data);
        } catch (error) {
          console.error("❌ Lỗi khi tải sản phẩm:", error);
          toast.error(`Không thể tải sản phẩm: ${error.message}`);
        }
      };
      fetchAllProducts();
    }
  }, [openDialog]);

  const handleAddProductToCompare = (product) => {
    if (compareList.some((item) => item._id === product._id)) {
      toast.info("✅ Sản phẩm này đã có trong danh sách so sánh!");
      return;
    }
    dispatch(addToCompare(product));
    toast.success("➕ Đã thêm vào danh sách so sánh!");
    setOpenDialog(false);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, allProducts]);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📊 So sánh sản phẩm</h2>

      {console.log("🛍️ Danh sách so sánh:", compareList)}

      {compareList.length === 0 ? (
        <p className="text-gray-500">⚠️ Chưa có sản phẩm nào để so sánh.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compareList.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover rounded"
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
          onClick={() => {
            console.log("🆕 Mở modal thêm sản phẩm");
            setOpenDialog(true);
          }}
        >
          Thêm sản phẩm vào so sánh
        </Button>
      </div>

      {/* MODAL */}
      <Dialog
        open={openDialog}
        onClose={() => {
          console.log("❌ Đóng modal");
          setOpenDialog(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>🔎 Chọn sản phẩm để so sánh</DialogTitle>
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
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500">
                ❌ Không tìm thấy sản phẩm phù hợp.
              </p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="border p-4 rounded-lg shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded"
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
              ))
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              console.log("❌ Đóng modal");
              setOpenDialog(false);
            }}
            color="error"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Compare;
