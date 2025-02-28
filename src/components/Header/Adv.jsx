import { Grid, Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const saleBanners = [
  {
    id: 1,
    image:
      "https://hasaki.vn/_next/image?url=https%3A%2F%2Fmedia.hcdn.vn%2Fhsk%2F1740193290wapcn244-7days.jpg&w=3840&q=90",
    products: [
      {
        name: "Tsubaki",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRqe_m1NQ5dBRjlsTxkq_O_SL_aXp4zgxMFPaXj7Hy6zbj7WyN2pTliv7WE1GCsCAY9kE&usqp=CAU",
      },
      {
        name: "Diane",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRqe_m1NQ5dBRjlsTxkq_O_SL_aXp4zgxMFPaXj7Hy6zbj7WyN2pTliv7WE1GCsCAY9kE&usqp=CAU",
      },
      { name: "TRESemmé", image: "https://example.com/tresemme.jpg" },
    ],
  },
  {
    id: 2,
    image: "https://media.hcdn.vn/hsk/campaign/640x240-7ngay1657508437.jpg",
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
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "auto",
        overflow: "hidden",
        background: "#326f51",
      }}
    >
      <Slider {...settings}>
        {saleBanners.map((banner) => (
          <Box
            key={banner.id}
            sx={{ width: "100vw", height: "auto", background: "#326f51" }}
          >
            <Grid container spacing={0} sx={{ height: "100%" }}>
              {/* Banner Chính */}
              <Grid item xs={12} md={8} sx={{ position: "relative" }}>
                <img
                  src={banner.image}
                  alt={banner.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "5%",
                    color: "#fff",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {banner.title}
                  </Typography>
                  <Typography variant="body1">{banner.description}</Typography>
                  <Typography variant="h5" color="red" fontWeight="bold">
                    {banner.offer}
                  </Typography>
                </Box>
              </Grid>

              {/* Ưu Đãi Bên Phải */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "bg-[#326f51]",
                    color: "#fff",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    FREESHIP
                  </Typography>
                  <Typography variant="body1">
                    Freeship toàn quốc đơn từ 89K
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    🎉 TẶNG 10% ĐƠN ĐẦU TIÊN 🎉
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, background: "#fff", color: "#ff9800" }}
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
