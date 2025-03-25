import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById } from "../../services/blogServive";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Breadcrumbs,
  Link,
  Paper,
  TextField,
  Button,
  List,
  Avatar,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendIcon from "@mui/icons-material/Send";

// Component chính cho trang chi tiết blog
const BlogDetail = () => {
  // Khai báo state và hook
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // Fetch dữ liệu blog và comments khi id thay đổi
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
    const savedComments =
      JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    setComments(savedComments);
  }, [id]);

  // Xử lý submit bình luận
  const handleCommentSubmit = () => {
    if (comment.trim() === "") return;

    const newComment = {
      text: comment,
      time: new Date().toLocaleString(),
    };
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setComment("");
  };

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render khi không tìm thấy blog
  if (!blog) {
    return (
      <Typography variant="h6" align="center" color="error" sx={{ mt: 5 }}>
        Không tìm thấy bài viết!
      </Typography>
    );
  }

  // Render giao diện chính
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs điều hướng */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mt: 2, mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/blog")}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Blog
        </Link>
        <Typography color="text.primary">{blog.title}</Typography>
      </Breadcrumbs>

      {/* Tiêu đề blog */}
      <Typography
        variant="h1"
        component="h1"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: "2.5rem", md: "3.75rem" },
          color: "text.primary",
        }}
      >
        {blog.title}
      </Typography>

      {/* Hình ảnh chính */}
      {blog.image && (
        <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={blog.image}
            alt={blog.title}
            sx={{
              maxWidth: "300px",
              width: "100%",
              borderRadius: 2,
              boxShadow: 2,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          />
        </Box>
      )}

      {/* Nội dung blog */}
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, mb: 6 }}>
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, fontSize: "1.1rem", color: "text.secondary" }}
        >
          {blog.content}
        </Typography>

        {/* Chi tiết bổ sung */}
        {blog.detail?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Chi tiết bổ sung
            </Typography>
            {blog.detail.map((item) => (
              <Box key={item._id} sx={{ mb: 3 }}>
                {item.image && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt="Detail image"
                      sx={{
                        maxWidth: "200px",
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: "transform 0.3s",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    />
                  </Box>
                )}
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                    color: "text.secondary",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Phần bình luận */}
      <Box sx={{ mb: 4 }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bình luận
        </Typography>

        {/* Form nhập bình luận */}
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            mb: 3,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>U</Avatar>
          <TextField
            label="Viết bình luận..."
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            sx={{ ml: 2, minWidth: "100px" }}
            endIcon={<SendIcon />}
          >
            Gửi
          </Button>
        </Paper>

        {/* Danh sách bình luận */}
        <List>
          {comments.length > 0 ? (
            comments.map((cmt, index) => (
              <Paper
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  transition: "background-color 0.3s",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
              >
                <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>U</Avatar>
                <Box>
                  <Typography variant="body1">{cmt.text}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {cmt.time}
                  </Typography>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "center" }}
            >
              Chưa có bình luận nào.
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default BlogDetail;
