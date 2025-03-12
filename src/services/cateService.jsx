import { useEffect, useState } from "react";
import axiosClient from "./api.config";

const useCategoryService = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Gọi API lấy danh sách danh mục
        const categoryRes = await axiosClient.get("/api/products/categories");
        const categoryList = categoryRes.data;

        // Gọi API lấy 1 sản phẩm đầu tiên của mỗi danh mục
        const productPromises = categoryList.map(async (category) => {
          const productRes = await axiosClient.get(
            `/api/products/category/${category}?limit=1`,
          );
          return {
            name: category,
            product: productRes.data[0] || null, // Nếu không có sản phẩm thì để null
          };
        });

        const categoriesWithProducts = await Promise.all(productPromises);
        setCategories(categoriesWithProducts);
      } catch (error) {
        console.error(
          "Lỗi khi lấy danh mục:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

export default useCategoryService;
