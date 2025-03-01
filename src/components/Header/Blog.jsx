import React, { useEffect, useState } from "react";
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
        fontWeight={600}
        color="green"
      >
        Tin Tức & Cẩm Nang
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {blog.image && (
                <CardMedia
                  component="img"
                  image={blog.image}
                  alt={blog.title}
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent>
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

export default Blog;
