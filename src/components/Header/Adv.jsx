import { Grid, Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const saleBanners = [
  {
    id: 1,
    image: "https://media.hcdn.vn/hsk/1732069393web.jpg",
    title: "Ưu đãi 7 ngày",
    description: "Giảm giá cực sốc cho sản phẩm chăm sóc tóc!",
    offer: "GIẢM ĐẾN 50%",
    products: [
      {
        name: "Tsubaki",
        image: "https://media.hcdn.vn/hsk/1742812994homedhc2403.jpg",
      },
      {
        name: "Diane",
        image: "https://media.hcdn.vn/hsk/1742813288homecarsalan2403.jpg",
      },
      { name: "TRESemmé", image: "https://example.com/tresemme.jpg" },
    ],
  },
  {
    id: 2,
    image: "https://media.hcdn.vn/hsk/1742813288homecarsalan2403.jpg",
    title: "Siêu Sale Tháng 10",
    description: "Mua sắm thả ga, giá siêu hấp dẫn!",
    offer: "GIẢM ĐẾN 40%",
  },
];

const Adv = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    customPaging: () => (
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: "white",
          borderRadius: "50%",
          mx: 1,
          "&:hover": { bgcolor: "#4ade80" }, // green-400
        }}
      />
    ),
  };

  return (
    <Box
    // sx={{
    //   bgcolor: "#15803d", // green-700
    //   py: 4,
    //   overflow: "hidden",
    // }}
    >
      <Slider {...settings}>
        {saleBanners.map((banner) => (
          <Box
            key={banner.id}
            sx={{
              height: "400px",
              bgcolor: "#15803d", // green-700
              position: "relative",
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              {/* Banner chính */}
              <Grid item xs={12} md={8} sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={banner.image}
                  alt={banner.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "5%",
                    transform: "translateY(-50%)",
                    color: "white",
                    textAlign: "left",
                    px: 3,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: "white",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {banner.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: "1.2rem",
                      color: "grey.200",
                      textShadow: "1px 1px 6px rgba(0,0,0,0.4)",
                    }}
                  >
                    {banner.description}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "yellow.main",
                      fontWeight: "bold",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {banner.offer}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      px: 4,
                      py: 1.2,
                      fontWeight: "bold",
                      borderRadius: 2,
                      bgcolor: "white",
                      color: "#15803d", // green-700
                      "&:hover": { bgcolor: "#d1fae5", color: "#15803d" }, // green-100
                    }}
                  >
                    Mua Ngay
                  </Button>
                </Box>
              </Grid>

              {/* Thông tin ưu đãi */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    bgcolor: "#4ade80", // green-400, sáng hơn green-700
                    p: 4,
                    color: "grey.900",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "grey.900", mb: 2 }}
                  >
                    FREESHIP
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, fontSize: "1.1rem", color: "grey.800" }}
                  >
                    Freeship toàn quốc đơn từ 89K
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, color: "orange.main", fontWeight: "bold" }}
                  >
                    🎉 TẶNG 10% ĐƠN ĐẦU 🎉
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "black",
                      color: "#15803d",
                      px: 4,
                      py: 1.2,
                      fontWeight: "bold",
                      borderRadius: 2,
                      bgcolor: "white",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "white",
                        borderColor: "white",
                      },
                    }}
                  >
                    Nhận Ngay
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Adv;
