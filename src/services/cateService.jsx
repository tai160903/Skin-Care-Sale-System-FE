import { useEffect, useState } from "react";
import axios from "axios";

const useCategoryService = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Gọi API lấy danh sách danh mục
        const categoryRes = await axios.get("http://localhost:8080/api/products/categories");
        const categoryList = categoryRes.data;

        // Gọi API lấy 1 sản phẩm đầu tiên của mỗi danh mục
        const productPromises = categoryList.map(async (category) => {
          const productRes = await axios.get(`http://localhost:8080/api/products/category/${category}?limit=1`);
          return {
            name: category,
            product: productRes.data[0] || null, // Nếu không có sản phẩm thì để null
          };
        });

        const categoriesWithProducts = await Promise.all(productPromises);
        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

export default useCategoryService;
