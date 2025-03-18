import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import cartService from "../services/cartService";
import { toast } from "react-toastify";
import useTopProductService from "../services/topProduct";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Rating,
  Button,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
  ],
};

const TopProduct = () => {
  const { products, loading } = useTopProductService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerId = useSelector((state) => state.user.customer?._id);

  const handleBuyNow = async (product) => {
    if (!customerId) {
      toast.error("Bạn phải đăng nhập trước!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }

    try {
      await cartService.addToCart({
        productId: product._id,
        quantity: 1,
        customerId,
      });

      dispatch(addToCart({ product, quantity: 1 }));
      navigate("/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container
      sx={{
        background: "#f8f9fa",
        p: 3,
        borderRadius: "10px",
        minWidth: "100%",
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 2 }}>
        Bán chạy
      </Typography>
      <Slider {...settings}>
        {products.map((product) => {
          const priceAfterDiscount =
            product.price * (1 - product.discountPercentage / 100);
          return (
            <Box
              key={product._id}
              textAlign="center"
              sx={{
                px: 1,
                py: 2,
                borderRadius: "10px",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  margin: "0 auto",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <img
                  src={product.image || "https://via.placeholder.com/160"}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {product.discountPercentage > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "red",
                      color: "white",
                      px: "6px",
                      py: "3px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      boxShadow: 2,
                    }}
                  >
                    -{product.discountPercentage}%
                  </Box>
                )}
              </Box>

              <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                {product.name}
              </Typography>

              <Rating
                name="half-rating-read"
                defaultValue={product.rating || 0}
                precision={0.5}
                readOnly
                sx={{ mt: 1 }}
              />

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 1,
                  minHeight: "40px",
                  maxHeight: "60px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                }}
              >
                {product.description}
              </Typography>

              <Box
                mt={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                {product.discountPercentage > 0 ? (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "gray",
                        fontSize: "14px",
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "red",
                        fontSize: "18px",
                      }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(priceAfterDiscount)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" fontWeight="bold" color="red">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1, borderRadius: "20px", textTransform: "none" }}
                onClick={() => handleBuyNow(product)}
              >
                Mua ngay
              </Button>
            </Box>
          );
        })}
      </Slider>
    </Container>
  );
};

export default TopProduct;
