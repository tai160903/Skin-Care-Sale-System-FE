import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productService from "../services/productService";
import { formatCurrency } from "../utils/formatCurrency";
import { Box } from "@mui/material";

function Allproduct() {
  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(query.get("category") || "");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 500000,
    sortBy: "default",
  });

  useEffect(() => {
    fetchCategories();
  }, []); // Chỉ gọi 1 lần khi component mount

  useEffect(() => {
    fetchProducts();
  }, [q, category]);

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
      });
      setProducts(response.data?.data || []);
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

  return (
    <div className="mx-auto p-4 flex gap-4">
      <div className="w-64 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>

        <label className="block font-medium mb-1">Danh mục:</label>
        <select
          name="category"
          value={category}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Tất cả</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block font-medium mb-1">Khoảng giá:</label>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-1/2 p-2 border rounded"
            placeholder="Từ"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-1/2 p-2 border rounded"
            placeholder="Đến"
          />
        </div>

        <label className="block font-medium mb-1">Sắp xếp:</label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="default">Mặc định</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>

        <button
          onClick={fetchProducts}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Áp dụng bộ lọc
        </button>
        <button
          onClick={() => {
            setFilters({
              category: "",
              minPrice: 0,
              maxPrice: 500000,
              sortBy: "default",
            });
            setCategory("");
          }}
          className="w-full p-2 bg-gray-300 rounded mt-2"
        >
          Xóa bộ lọc
        </button>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">
          Sản phẩm ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition relative"
              >
                <a href={`/product/detail/${product._id}`}>
                  {product.discountPercentage > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        bgcolor: "error.main",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      -{product.discountPercentage}%
                    </Box>
                  )}
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <h3 className="text-sm font-medium mt-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-red-600 font-semibold">
                    {formatCurrency(product.price)}
                  </p>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Allproduct;
