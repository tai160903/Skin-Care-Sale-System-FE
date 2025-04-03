import { Grid, Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const saleBanners = [
  {
    id: 1,
    image:
      "https://cdn.pixabay.com/photo/2024/10/18/03/53/ai-generated-9129335_640.jpg",
    title: "Ưu đãi 7 ngày",
    description: "Giảm giá cực sốc cho sản phẩm chăm sóc tóc!",
    offer: "GIẢM ĐẾN 50%",
  },
  {
    id: 2,
    image:
      "https://cdn.pixabay.com/photo/2024/10/18/03/53/ai-generated-9129335_640.jpg",
    title: "Siêu Sale Tháng 10",
    description: "Mua sắm thả ga, giá siêu hấp dẫn!",
    offer: "GIẢM ĐẾN 40%",
  },
];

const Adv = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    fade: true,
    customPaging: () => (
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
          mx: 0.75,
          transition: "all 0.3s ease",
          "&:hover": { bgcolor: "#fff", transform: "scale(1.2)" },
        }}
      />
    ),
  };

  return (
    <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
      <Slider {...settings}>
        {saleBanners.map((banner) => (
          <Box
            key={banner.id}
            sx={{
              height: { xs: "400px", md: "500px" },
              position: "relative",
              bgcolor: "#f5f5f5",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "2px solid  #326f51", // Added green border
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  position: "relative",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={banner.image}
                  alt={banner.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    p: { xs: 2, md: 4 },
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: "1.5rem", md: "2.5rem" },
                    }}
                  >
                    {banner.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      fontSize: { xs: "0.9rem", md: "1.2rem" },
                      opacity: 0.9,
                    }}
                  >
                    {banner.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#00c853", // Changed to green
                        fontWeight: 700,
                        fontSize: { xs: "1.2rem", md: "2rem" },
                      }}
                    >
                      {banner.offer}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      bgcolor: "#00c853", // Changed to green
                      color: "white",
                      px: 3,
                      py: 1,
                      borderRadius: 20,
                      mb: 3,
                      fontWeight: 700,
                    }}
                  >
                    FREESHIP TOÀN QUỐC
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "#333",
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                    }}
                  >
                    Miễn phí vận chuyển cho đơn từ 89K
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#00c853", // Changed to green
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    TẶNG 10% ĐƠN ĐẦU
                  </Typography>
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
