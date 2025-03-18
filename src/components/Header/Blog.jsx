import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getBlogs } from "../../services/blogServive";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook để điều hướng

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        fontWeight={700}
        color="primary"
        sx={{ mb: 4 }}
      >
        Tin Tức & Cẩm Nang
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {blogs.slice(0, 16).map((blog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
            <Card
              onClick={() => navigate(`/blog/${blog._id}`)} // Điều hướng đến trang chi tiết
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
                boxShadow: 3,
                borderRadius: 3,
                height: 380,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {blog.image && (
                <CardMedia
                  component="img"
                  image={blog.image}
                  alt={blog.title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {blog.title.length > 60
                    ? blog.title.slice(0, 57) + "..."
                    : blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: "0.9rem", lineHeight: 1.5 }}
                >
                  {blog.content.length > 120
                    ? blog.content.slice(0, 120) + "..."
                    : blog.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Blog;
