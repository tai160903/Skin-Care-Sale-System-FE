import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productService from "../services/productService";
import { formatCurrency } from "../utils/formatCurrency";
import { Box, Pagination, Rating, Button } from "@mui/material";

function Allproduct() {
  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(query.get("category") || "");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 9999999,
    sortBy: "default",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [q, category, page]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getAllCategory();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts({
        ...filters,
        q,
        category,
        page,
        limit,
      });
      setProducts(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      setProducts([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") setCategory(value);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: 500000,
      sortBy: "default",
    });
    setCategory("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Sidebar Filters */}
      <div className="w-72 bg-gray-50 p-6 rounded-xl shadow-sm sticky top-6 h-fit">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bộ lọc</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={category}
              onChange={handleFilterChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Tất cả</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng giá
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Từ"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Đến"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp
            </label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={fetchProducts}
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
            >
              Áp dụng
            </Button>
            <Button
              onClick={resetFilters}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": { borderColor: "#9ca3af" },
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Sản phẩm ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            Không tìm thấy sản phẩm nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
              >
                <a href={`/product/detail/${product._id}`} className="block">
                  {product.discountPercentage > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "red",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "9999px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      -{product.discountPercentage}%
                    </Box>
                  )}
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-base font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <Rating
                    value={product.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ my: 1 }}
                  />
                  <p className="text-red-600 font-bold text-lg">
                    {formatCurrency(product.price)}
                  </p>
                </a>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Allproduct;
