import { useEffect, useState } from "react";
import axiosClient from "./api.config";

const useTopProductService = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axiosClient.get("/api/products/top-sell");
        setProducts(response.data);
      } catch (error) {
        console.error(
          "Lỗi khi lấy dữ liệu:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return { products, loading };
};

export default useTopProductService;
