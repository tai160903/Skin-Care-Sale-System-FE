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
} from "@mui/material";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        minHeight="60vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box p={3}>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
      >
        Quay về Trang Chủ
      </button>
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
      <Grid container spacing={3} justifyContent="flex-start">
        {blogs.slice(0, 16).map((blog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
            <Card
              onClick={() => navigate(`/blog/${blog._id}`)}
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
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
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {blog.content}
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
