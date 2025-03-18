import { Container, Typography, Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";

const settings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getAllCategory();
        setCategories(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể lấy danh mục sản phẩm",
        );
      }
    };
    fetchCategories();
  }, []);

  return (
    <Container
      sx={{
        background: "#ffffff",
        p: 3,
        borderRadius: "16px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        minWidth: "100%",
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 3, textAlign: "center", textTransform: "uppercase" }}
      >
        Danh mục sản phẩm
      </Typography>

      <Slider {...settings}>
        {categories.map((category) => (
          <Box
            key={category.id}
            textAlign="center"
            sx={{
              px: 2,
              py: 2,
              mx: 1,
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              transform: "scale(1)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: "120px",
                height: "120px",
                mx: "auto",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                mt: 2,
                fontSize: "14px",
                color: "#333",
                textTransform: "capitalize",
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default Category;
