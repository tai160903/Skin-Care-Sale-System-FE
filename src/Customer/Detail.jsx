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
import { addToCompare } from "../redux/slices/compareSlice";
import Content from "./Content";
import { formatCurrency } from "../utils/formatCurrency";
import reviewService from "../services/reviewService";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const customerId = useSelector((state) => state.user.customer?._id);
  const role = useSelector((state) => state.user.user?.role);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getReviewsByProductId(id);
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchReviews();
      fetchProduct();
      setQuantity(1);
    }
  }, [id]);

  const handleIncreaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Số lượng vượt quá hàng tồn kho!");
    }
  };

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

    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Số lượng vượt quá hàng tồn kho!");
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

    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Số lượng vượt quá hàng tồn kho!");
      return;
    }

    await handleAddToCart();
    if (customerId) navigate("/cart");
  };

  const handleCompare = () => {
    dispatch(addToCompare(product));
    toast.success("Đã thêm vào danh sách so sánh!");
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
    <div className="container mx-auto p-8">
      <button
        onClick={() => navigate("/")}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out mb-6"
      >
        Quay về Trang Chủ
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="flex items-center gap-3">
            <Rating
              name="half-rating-read"
              value={product.rating || 0}
              precision={0.5}
              readOnly
              size="medium"
              sx={{ color: "#facc15" }}
            />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-orange-500">
                {product.rating ? product.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-2xl font-bold text-gray-800">/5</span>
            </div>
          </div>
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

          <div className="flex items-center mt-4 space-x-4">
            {product.stock === 0 ? (
              <span className="text-lg font-bold text-red-500">Hết hàng</span>
            ) : (
              <>
                <IconButton
                  onClick={handleDecreaseQuantity}
                  color="error"
                  disabled={product.stock === 0}
                >
                  <FaMinus />
                </IconButton>
                <span className="text-lg font-semibold">{quantity}</span>
                <IconButton
                  onClick={handleIncreaseQuantity}
                  color="primary"
                  disabled={product.stock === 0}
                >
                  <FaPlus />
                </IconButton>
              </>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            {role === "customer" && (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<FiShoppingCart />}
                  onClick={handleAddToCart}
                  className="bg-orange-500"
                  disabled={product.stock === 0}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleBuyNow}
                  className="bg-green-200"
                  disabled={product.stock === 0}
                >
                  Mua ngay
                </Button>
              </>
            )}
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
      <div className="mt-8 w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Đánh Giá Sản Phẩm
        </h3>
        <div className="bg-white rounded-xl shadow-md p-6 max-h-96 overflow-y-auto">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-200 pb-6 last:border-none last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold">
                        {review.customer_id.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                          {review.customer_id.name}
                        </span>
                        <small className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </small>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{ color: "#facc15" }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {review.rating ? review.rating.toFixed(1) : "0.0"}/5
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Chưa có đánh giá nào</p>
              <p className="text-gray-400 text-sm mt-1">
                Hãy là người đầu tiên đánh giá sản phẩm này!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Detail;
