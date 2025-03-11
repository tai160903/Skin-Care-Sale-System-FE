import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Rating, Button, IconButton } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdCompare } from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { addToCart } from "../redux/slices/cartSlice";
import { addToCompare } from "../redux/slices/compareSlice"; // Thêm action để so sánh
import Content from "./Content";
import { formatCurrency } from "../utils/formatCurrency";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const customerId = useSelector((state) => state.user.customer?._id);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      setQuantity(1);
    }
  }, [id]);

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = async () => {
    if (!customerId) {
      toast.error("Bạn phải đăng nhập!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }

    if (!product) {
      toast.error("Sản phẩm không tồn tại");
      return;
    }

    try {
      await cartService.addToCart({
        productId: product._id,
        quantity,
        customerId,
      });

      dispatch(addToCart({ product, quantity }));
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (customerId) navigate("/cart");
  };

  const handleCompare = () => {
    dispatch(addToCompare(product));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-gray-500">Sản phẩm không tồn tại</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <Rating
            name="half-rating-read"
            defaultValue={product.rating || 0}
            precision={0.5}
            readOnly
          />
          <p className="text-gray-500 text-sm">{product.description}</p>
          <p className="text-gray-600 mt-2">
            Số lượng còn lại: <strong>{product.stock}</strong>
          </p>
          <p className="text-gray-600">
            Đã bán: <strong>{product.purchaseCount}</strong>
          </p>

          <div className="mt-3">
            <span
              className={`mr-5 text-2xl font-bold ${
                product.discountPercentage > 0
                  ? "line-through text-gray-500"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-2xl p-2 font-bold rounded-md text-white bg-red-500">
                  - {product.discountPercentage}%
                </span>
                <div>
                  <span className="text-2xl font-bold text-red-500">
                    {formatCurrency(
                      product.price * (1 - product.discountPercentage / 100),
                    )}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Số lượng */}
          <div className="flex items-center mt-4 space-x-4">
            <IconButton onClick={handleDecreaseQuantity} color="error">
              <FaMinus />
            </IconButton>
            <span className="text-lg font-semibold">{quantity}</span>
            <IconButton onClick={handleIncreaseQuantity} color="primary">
              <FaPlus />
            </IconButton>
          </div>

          {/* Nút thao tác */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="contained"
              color="warning"
              startIcon={<FiShoppingCart />}
              onClick={handleAddToCart}
              className="bg-orange-500"
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleBuyNow}
              className="bg-green-500"
            >
              Mua ngay
            </Button>
            <Button
              variant="contained"
              color="info"
              startIcon={<MdCompare />}
              onClick={handleCompare}
              className="bg-blue-500"
            >
              So sánh
            </Button>
          </div>
        </motion.div>
      </div>
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
