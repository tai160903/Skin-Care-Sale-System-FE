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
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
  pauseOnHover: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const TopProduct = () => {
  const { products, loading } = useTopProductService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerId = useSelector((state) => state.user.customer?._id);

  const handleBuyNow = async (product) => {
    if (!customerId) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
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
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        textAlign="center"
        sx={{ mb: 4, textTransform: "uppercase", letterSpacing: 1 }}
      >
        Sản Phẩm Đỉnh Cao
      </Typography>

      <Slider {...sliderSettings}>
        {products.map((product) => {
          const priceAfterDiscount =
            product.price * (1 - product.discountPercentage / 100);

          return (
            <Box key={product._id} sx={{ p: 2 }}>
              <Card
                sx={{
                  maxWidth: 250,
                  mx: "auto",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={product.image || "https://placehold.co/400"}
                    alt={product.name}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      maxHeight: "150px",
                    }}
                  />
                  {product.discountPercentage > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        bgcolor: "error.main",
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      -{product.discountPercentage}%
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    noWrap
                    sx={{ mb: 1, color: "text.primary" }}
                  >
                    {product.name}
                  </Typography>

                  <Rating
                    value={product.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ mb: 1 }}
                  />

                  <Box sx={{ mb: 2 }}>
                    {product.discountPercentage > 0 ? (
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="error.main"
                          fontWeight="bold"
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(priceAfterDiscount)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="h6"
                        color="error.main"
                        fontWeight="bold"
                      >
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
                    size="medium"
                    fullWidth
                    sx={{
                      borderRadius: 20,
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1,
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                    onClick={() => handleBuyNow(product)}
                  >
                    Mua Ngay
                  </Button>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Slider>
    </Container>
  );
};

export default TopProduct;
