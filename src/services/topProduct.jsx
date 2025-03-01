import { useEffect, useState } from "react";
import axios from "axios";

const useTopProductService = () => {
  // ✅ Đổi tên thành "useTopProductService"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products/top-sell")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  return { products, loading };
};

export default useTopProductService;
