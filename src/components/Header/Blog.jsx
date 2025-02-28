import React from "react";
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material";

const blogPosts = [
  {
    id: 1,
    title: "Tiết Kiệm Chi Phí Và Giảm Rác Thải Với Bông Tẩy Trang",
    description:
      "Bông tẩy trang Guardian được làm từ sợi tre thân thiện với môi trường.",
    image:
      "https://hasaki.vn/_next/image?url=https%3A%2F%2Fmedia.hcdn.vn%2Fhsk%2F1740393623waptinviet2402.jpg&w=3840&q=90",
  },
  {
    id: 2,
    title: "Phấn Nước Vely Vely - Cho Lớp Nền Mịn Màng",
    description:
      "Khả năng che khuyết điểm cực kỳ tốt với độ bền màu lên đến 18 giờ dưỡng làn da tự nhiên.",
    image:
      "https://i.ytimg.com/vi/OqBGFnnDsz0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCW2wMH6zs_gSeA1RszuN5_iINW-g",
  },
  {
    id: 3,
    title: "Chính Sách Bảo Hành Của Bàn Chải Điện Oral-B",
    description:
      "Công ty đối tác nhập khẩu bàn chải điện Oral-B với bảo hành chính hãng.",
    image:
      "https://channel.mediacdn.vn/428462621602512896/2024/7/16/photo-1-17211305545961265677686.jpg",
  },
  {
    id: 4,
    title: "Licorne - Giải Pháp Chữa Lành Cho Mọi Loại Da",
    description:
      "Mỹ phẩm thuần chay Licorne giúp nuôi dưỡng làn da tự nhiên dưỡng làn da tự nhiên.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD8vzLfqf2HMrpWM1CEj56m2iK0KW-uL1rv3zw6YnSXbe8k3oEMCAVe95kXTPqtYyemKQ&usqp=CAU",
  },
  {
    id: 5,
    title: "Tiết Kiệm Chi Phí Và Giảm Rác Thải Với Bông Tẩy Trang",
    description:
      "Bông tẩy trang Guardian được làm từ sợi tre thân thiện với môi trường.",
    image:
      "https://hasaki.vn/_next/image?url=https%3A%2F%2Fmedia.hcdn.vn%2Fhsk%2F1740393623waptinviet2402.jpg&w=3840&q=90",
  },
  {
    id: 6,
    title: "Phấn Nước Vely Vely - Cho Lớp Nền Mịn Màng",
    description:
      "Khả năng che khuyết điểm cực kỳ tốt với độ bền màu lên đến 18 giờ dưỡng làn da tự nhiên.",
    image:
      "https://i.ytimg.com/vi/OqBGFnnDsz0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCW2wMH6zs_gSeA1RszuN5_iINW-g",
  },
];

const Blog = () => {
  return (
    <Grid container spacing={3} sx={{ padding: "20px" }}>
      {/* Tiêu đề */}
      <Grid item xs={12}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="green"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Tin Tức & Cẩm Nang
        </Typography>
      </Grid>

      {/* Danh sách bài viết */}
      {blogPosts.map((post) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardMedia
              component="img"
              image={post.image}
              alt={post.title}
              sx={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
              }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {post.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {post.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Blog;
