import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCompare,
  clearCompare,
  removeFromCompare,
} from "../redux/slices/compareSlice";
import { FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { Rating, Button, IconButton, Tooltip } from "@mui/material";
import { formatCurrency } from "../utils/formatCurrency";
import productService from "../services/productService";
import debounce from "lodash/debounce";

function Compare() {
  const dispatch = useDispatch();
  const compareList = useSelector((state) => state.compare?.products || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    debounce(async (term) => {
      try {
        const response = await productService.getAllProducts({
          q: term,
          limit: 50,
        });
        const filteredProducts = response.data?.data.filter(
          (product) => !compareList.some((p) => p._id === product._id),
        );
        setProducts(filteredProducts);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      }
    }, 300),
    [compareList],
  );

  useEffect(() => {
    if (isModalOpen) {
      fetchProducts(searchTerm);
    }
  }, [isModalOpen, searchTerm, fetchProducts]);

  const handleAddToCompare = (product) => {
    dispatch(addToCompare(product));
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          So sánh sản phẩm
        </h2>
        <div>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Thêm sản phẩm
          </Button>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => dispatch(clearCompare())}
            sx={{
              bgcolor: "#ef4444",
              "&:hover": { bgcolor: "#dc2626" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              ml: 2,
            }}
          >
            Xóa tất cả
          </Button>
        </div>
      </div>

      {compareList.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-xl mb-4">
            Chưa có sản phẩm nào để so sánh
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {[
                    "Ảnh",
                    "Tên",
                    "Giá",
                    "Đánh giá",
                    "Lượt mua",
                    "Loại da",
                    "Thành phần",
                    "Hành động",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-4 text-left font-semibold text-sm uppercase tracking-wide"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareList.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {product.name}
                    </td>
                    <td className="p-4 text-red-600 font-bold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-4">
                      <Rating
                        value={product.rating || 0}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.purchaseCount} lượt
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.skinType?.length > 0
                        ? product.skinType
                            .map((type) => type.VNname || type.name)
                            .join(", ")
                        : "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.ingredient || "N/A"}
                    </td>
                    <td className="p-4">
                      <Tooltip title={`Xóa ${product.name}`}>
                        <IconButton
                          color="error"
                          onClick={() =>
                            dispatch(removeFromCompare(product._id))
                          }
                          aria-label={`Xóa ${product.name} khỏi danh sách so sánh`}
                        >
                          <FiTrash2 size={20} />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🛍</span> Thêm sản phẩm
              </h3>
              <IconButton
                onClick={() => setIsModalOpen(false)}
                sx={{ color: "#6b7280" }}
              >
                ✕
              </IconButton>
            </div>

            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <div className="max-h-80 overflow-y-auto space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  Không tìm thấy sản phẩm nào.
                </p>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-base">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAddToCompare(product)}
                      sx={{
                        bgcolor: "#3b82f6",
                        "&:hover": { bgcolor: "#2563eb" },
                        borderRadius: "6px",
                        textTransform: "none",
                      }}
                    >
                      Thêm
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;
