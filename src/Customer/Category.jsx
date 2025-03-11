import { Container, Typography, Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
  {
    id: 1,
    name: "Trang Điểm Môi",
    image:
      "https://bizweb.dktcdn.net/100/136/276/products/kem-chong-nang-a6aff683-14c0-46bd-9114-eae82ff2224c.jpg?v=1675215528467",
  },
  {
    id: 2,
    name: "Mặt Nạ",
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltrw8pdzmmfh6b",
  },
  {
    id: 3,
    name: "Trang Điểm Mặt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTsLJg6P4IaoRmjIeNHIdYP68Kr3OugNyVmA&s",
  },
  {
    id: 4,
    name: "Sữa Rửa Mặt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2GADDVfU_neQ2z8nDSl5MEoSydzGhJbuBgg&s",
  },
  {
    id: 5,
    name: "Trang Điểm Mắt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGeelFmL7Onl9HVUnMHP02XZwJv1qE-kh_2g&s",
  },
  {
    id: 6,
    name: "Dầu Gội Và Dầu Xả",
    image:
      "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltrw8pdzmmfh6b",
  },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 6, slidesToScroll: 2 } },
    { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 1 } },
    { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } },
  ],
};

const Category = () => {
  return (
    <Container
      sx={{
        background: "#f8f9fa",
        p: 2,
        borderRadius: "12px",
        boxShadow: 2,
        minWidth: "100%",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="green"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Danh mục sản phẩm
      </Typography>
      <Slider {...settings} style={{ gap: "10px" }}>
        {categories.map((category) => (
          <Box
            key={category.id}
            textAlign="center"
            sx={{
              px: 1,
              py: 1.5,
              mx: 1,
              background: "white",
              borderRadius: "12px",
              boxShadow: 1,
              transition: "transform 0.3s, box-shadow 0.3s",
              transform: "scale(0.95)",
              "&:hover": {
                transform: "scale(1)",
                boxShadow: 4,
              },
            }}
          >
            <Box
              sx={{
                width: "100px",
                height: "100px",
                mx: "auto",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: 2,
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ mt: 1, fontSize: "13px" }}
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
