import { Container, Typography, Box, CircularProgress } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import productService from "../services/productService";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: Math.min(categories.length, 5),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllCategory();
        setCategories(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể tải danh mục sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary.main"
        sx={{
          mb: 4,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1.5,
        }}
      >
        Danh Mục Sản Phẩm
      </Typography>

      <Slider {...sliderSettings}>
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              p: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: "grey.100",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.15)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <a href={``}>
                <img
                  src={category.image || "https://via.placeholder.com/120"}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </a>
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{
                mt: 2,
                fontSize: "1rem",
                color: "text.primary",
                textTransform: "capitalize",
                maxWidth: 120,
                mx: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
