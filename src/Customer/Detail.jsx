import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Rating, Button, IconButton } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";
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
        toast.error("Error fetching product:", error);
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
      toast.error("You must be logged in!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }

    if (!product) {
      toast.error("Product not found!");
      return;
    }

    try {
      dispatch(addToCart({ product, quantity }));

      await cartService.addToCart({
        product_id: product._id,
        quantity,
        customerId,
      });

      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Error adding product to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (customerId) navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-gray-500">Product not found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product image */}
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

        {/* Product information */}
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

          <div className="mt-3">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-lg mr-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.originalPrice)}
              </span>
            )}
            <span className="text-red-500 text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center mt-4 space-x-4">
            <IconButton onClick={handleDecreaseQuantity} color="error">
              <FaMinus />
            </IconButton>
            <span className="text-lg font-semibold">{quantity}</span>
            <IconButton onClick={handleIncreaseQuantity} color="primary">
              <FaPlus />
            </IconButton>
          </div>

          {/* Buttons */}
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
          </div>
        </motion.div>
      </div>

      {/* Additional content */}
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
