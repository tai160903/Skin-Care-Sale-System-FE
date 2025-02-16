import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Rating, Button } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { addToCart } from "../redux/slices/cartSlice";
import Content from "./Content";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Lấy customerId từ Redux
  const customerId = useSelector((state) => state.user.customerId);

  useEffect(() => {
    let isMounted = true; // Để tránh lỗi memory leak

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        if (isMounted) setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      toast.error("❌ Không tìm thấy sản phẩm!");
      return;
    }

    if (!customerId) {
      toast.error("❌ Bạn chưa đăng nhập!");
      return;
    }

    try {
      // Cập nhật Redux ngay lập tức
      dispatch(addToCart({ productId: product.id, quantity: 1 }));

      // Gửi request lên server
      await cartService.addToCart({
        customerId,
        productId: product.id,
        quantity: 1,
      });

      toast.success("✅ Thêm vào giỏ hàng thành công!");

      setTimeout(() => navigate("/cart"), 1000);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      toast.error("❌ Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-gray-500">⚠️ Product not found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ảnh sản phẩm */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!imageLoaded && (
            <div className="flex justify-center items-center h-[500px] bg-gray-200">
              <CircularProgress />
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-[500px] object-cover rounded-lg shadow-lg transition-opacity ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Thông tin sản phẩm */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <Rating value={5} readOnly className="my-2" />
          <p className="text-gray-500 text-sm">{product.description}</p>

          {/* Giá sản phẩm */}
          <div className="mt-3">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-lg mr-2">
                {product.originalPrice}đ
              </span>
            )}
            <span className="text-red-500 text-2xl font-bold">
              {product.price ? `${product.price}đ` : "100.000đ"}
            </span>
          </div>

          {/* Quà tặng */}
          <div className="mt-4 bg-orange-100 p-4 rounded-lg">
            <h3 className="text-orange-600 font-bold">🎁 Quà tặng:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>
                FG ZA KEMLOT 02 PURPLE 4G - <span className="text-green-600">0đ</span>
              </li>
              <li>
                KEM LÓT ZA TRUE WHITE DAY PROTECTOR EX 4G - <span className="text-green-600">0đ</span>
              </li>
            </ul>
          </div>

          {/* Nút CTA */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="contained"
              color="warning"
              className="flex-1 text-white font-bold py-3 rounded-lg"
              startIcon={<FiShoppingCart />}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="contained"
              color="error"
              className="flex-1 text-white font-bold py-3 rounded-lg"
              onClick={handleBuyNow}
            >
              Mua ngay
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Nội dung chi tiết */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <Content />
      </motion.div>
    </div>
  );
}

export default Detail;
