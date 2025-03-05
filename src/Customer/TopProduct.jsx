import useTopProductService from "../services/topProduct";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Rating,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const TopProduct = () => {
  const { products, loading } = useTopProductService();

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
        mx: 0,
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 2 }}>
        Bán chạy
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Box
            key={product.id}
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
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
              }}
              className="text-center text-gray-800 truncate"
            >
              {product.description}
            </Typography>

            <Box mt={1}>
              {product.discountPercentage > 0 ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: "line-through", color: "gray" }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "red" }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      product.price * (1 - product.discountPercentage / 100),
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      background: "red",
                      color: "white",
                      p: "4px 8px",
                      borderRadius: "5px",
                      mt: 1,
                    }}
                  >
                    -{product.discountPercentage}%
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
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default TopProduct;
