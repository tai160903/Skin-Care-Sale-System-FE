import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../../services/blogServive";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Button,
  Container,
} from "@mui/material";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress size={50} thickness={4} color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <button
        onClick={() => navigate("/")}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out mb-6"
      >
        Quay về Trang Chủ
      </button>
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          position: "relative",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "-0.5px",
            mb: 2,
          }}
        >
          Blog & Tin Tức
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "#666", maxWidth: "600px", mx: "auto" }}
        >
          Khám phá những bài viết mới nhất, mẹo hay và thông tin hữu ích từ
          chúng tôi
        </Typography>
      </Box>

      {/* Blog Grid */}
      <Grid container spacing={4}>
        {blogs.slice(0, 16).map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card
              onClick={() => navigate(`/blog/${blog._id}`)}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
                bgcolor: "#fff",
              }}
            >
              {blog.image && (
                <CardMedia
                  component="img"
                  image={blog.image}
                  alt={blog.title}
                  sx={{
                    height: 220,
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              )}
              <CardContent
                sx={{
                  p: 3,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "#1a1a1a",
                      mb: 1.5,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#555",
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {blog.content}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  sx={{
                    mt: 2,
                    color: "#1976d2",
                    fontWeight: 600,
                    textTransform: "none",
                    justifyContent: "flex-start",
                    p: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "#115293",
                    },
                  }}
                >
                  Đọc thêm →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
