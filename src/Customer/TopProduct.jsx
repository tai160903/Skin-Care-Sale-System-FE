import React from "react";
import useTopProductService from "../services/topProduct";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 8,
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ background: "#f8f9fa", p: 3, borderRadius: "10px" }}>
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 2 }}>
        Bán chạy
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} textAlign="center" sx={{ px: 1 }}>
            <img
              src={product.image || "https://via.placeholder.com/200"}
              alt={product.name}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Typography variant="body2" color="textSecondary">
              {product.price.toLocaleString()} VND
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {product.name}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default TopProduct;
