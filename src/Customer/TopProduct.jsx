import { Container, Typography, Box } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const products = [
  {
    id: 1,
    name: "Sữa Rửa Mặt",
    sold: "12.167M đã bán",
    image:
      "https://sokhcn.tayninh.gov.vn/uploads/news/2023_11/image-20231122160426-2.jpeg",
  },
  {
    id: 2,
    name: "Chống Nắng Da Mặt",
    sold: "10.772M đã bán",
    image:
      "https://mekongasean.vn/stores/news_dataimages/mekongaseanvn/112023/20/17/171532627-1505306153135764-4488100351801308541-n-1310.jpg",
  },
  {
    id: 3,
    name: "Tẩy Trang Mặt",
    sold: "10.747M đã bán",
    image:
      "https://cdn-images.vtv.vn/thumb_w/640/2022/9/30/hasa5300922-16645082135321363621679.jpg",
  },
  {
    id: 4,
    name: "Kem / Gel Dưỡng",
    sold: "8.55M đã bán",
    image:
      "https://cdn.24h.com.vn/upload/2-2020/images/2020-06-18/Choang-ngop-truoc-khong-gian-rong-lon-tran-ngap-my-pham-chinh-hang-o-Hasaki-chi-nhanh-10-vua-khai-tr-24h-bai-pr-sau-truong-2-1592471846-681-width660height452.jpg",
  },
  {
    id: 5,
    name: "Serum / Tinh Chất",
    sold: "6.248M đã bán",
    image:
      "https://dongphucsaigon.vn/wp-content/uploads/2024/09/dong-phuc-nhan-vien-hasaki-01.jpg",
  },
  {
    id: 6,
    name: "Mặt Nạ Giấy",
    sold: "4.526M đã bán",
    image:
      "https://vcdn1-giaitri.vnecdn.net/2019/10/16/1308721575-w500-1571216040-1700-1571216091.jpeg?w=1200&h=0&q=100&dpr=1&fit=crop&s=mjCdx5p4jY-WseR2_6-_qw",
  },
  {
    id: 7,
    name: "Mặt Nạ ",
    sold: "4.526M đã bán",
    image:
      "https://vcdn1-giaitri.vnecdn.net/2019/10/16/1308721575-w500-1571216040-1700-1571216091.jpeg?w=1200&h=0&q=100&dpr=1&fit=crop&s=mjCdx5p4jY-WseR2_6-_qw",
  },
  {
    id: 8,
    name: "Mặt ",
    sold: "4.526M đã bán",
    image:
      "https://cdn.24h.com.vn/upload/2-2020/images/2020-06-18/Choang-ngop-truoc-khong-gian-rong-lon-tran-ngap-my-pham-chinh-hang-o-Hasaki-chi-nhanh-10-vua-khai-tr-24h-bai-pr-sau-truong-2-1592471846-681-width660height452.jpg",
  },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 2,
  autoplay: true, // Kích hoạt tự động xoay
  autoplaySpeed: 2000, // Thời gian giữa các lần chuyển slide (2 giây)
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const TopProduct = () => {
  return (
    <Container sx={{ background: "#f8f9fa", p: 3, borderRadius: "10px" }}>
      <Typography variant="h5" fontWeight="bold" color="green" sx={{ mb: 2 }}>
        Bán chạy
      </Typography>
      <Slider {...settings}>
        {products.map((product) => (
          <Box key={product.id} textAlign="center" sx={{ px: 1 }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "200px", // Kích thước cố định
                height: "200px",
                objectFit: "cover", // Cắt ảnh để vừa kích thước mà không bị méo
                borderRadius: "10px",
                display: "block",
                margin: "0 auto",
              }}
            />
            <Typography variant="body2" color="textSecondary">
              {product.sold}
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
