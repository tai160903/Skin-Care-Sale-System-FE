import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getBlogs } from "../services/blogServive";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const BlogList = () => {
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
        toast.error("Error fetching blogs:", error);
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
        fontWeight={600}
        color="green"
      >
        Tin Tức & Cẩm Nang
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {blogs.slice(0, 4).map((blog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
            <Card
              onClick={() => navigate(`/blog/${blog._id}`)} // Điều hướng đến trang chi tiết
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
                boxShadow: 3,
                borderRadius: 2,
                height: 350, // Cố định chiều cao của Card
                display: "flex",
                flexDirection: "column",
              }}
            >
              {blog.image && (
                <CardMedia
                  component="img"
                  image={blog.image}
                  alt={blog.title}
                  sx={{
                    width: "100%",
                    height: 180, // Cố định chiều cao ảnh
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {blog.content.length > 100
                    ? blog.content.slice(0, 100) + "..."
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

export default BlogList;
