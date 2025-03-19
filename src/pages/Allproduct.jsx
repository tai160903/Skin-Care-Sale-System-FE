import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productService from "../services/productService";

function Allproduct() {
  const query = new URLSearchParams(useLocation().search);
  const q = query.get("q");
  console.log(q);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 500000,
    sortBy: "default",
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters, q]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getAllCategory();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts({ ...filters, q });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto p-4 flex gap-4">
      <div className="w-64 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>

        {/* Danh mục */}
        <label className="block font-medium mb-1">Danh mục:</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Khoảng giá */}
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

        {/* Sắp xếp */}
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
      </div>

      {/* Danh sách sản phẩm */}
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
                className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-sm font-medium mt-2">{product.name}</h3>
                <p className="text-red-600 font-semibold">
                  {product.price.toLocaleString()}₫
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Allproduct;
