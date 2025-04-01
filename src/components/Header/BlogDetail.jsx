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
  Avatar,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendIcon from "@mui/icons-material/Send";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

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

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h5" align="center" color="error">
          Không tìm thấy bài viết!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 4 }}
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
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {blog.title.slice(0, 30) + (blog.title.length > 30 ? "..." : "")}
        </Typography>
      </Breadcrumbs>

      {/* Blog Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3.5rem" },
            fontWeight: 800,
            color: "#1a1a1a",
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {blog.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString()} {/* Giả lập ngày */}
          </Typography>
        </Box>
      </Box>

      {/* Main Image */}
      {blog.image && (
        <Box
          sx={{
            mb: 6,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            component="img"
            src={blog.image}
            alt={blog.title}
            sx={{
              width: "100%",
              height: { xs: 300, md: 500 },
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          />
        </Box>
      )}

      {/* Blog Content */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: "16px",
          bgcolor: "#fff",
          boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
          mb: 6,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            lineHeight: 1.8,
            color: "#333",
            "& p": { mb: 2 },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }} // Cho phép render HTML nếu cần
        />
        {blog.detail?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Thông tin thêm
            </Typography>
            {blog.detail.map((item) => (
              <Box key={item._id} sx={{ mb: 4 }}>
                {item.image && (
                  <Box sx={{ mb: 3 }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt="Detail image"
                      sx={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "cover",
                        borderRadius: "12px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                )}
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "#333" }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Comments Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Bình luận ({comments.length})
        </Typography>

        {/* Comment Form */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "12px",
            bgcolor: "#f9f9f9",
            mb: 4,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>
            <TextField
              placeholder="Viết bình luận của bạn..."
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: "#fff",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCommentSubmit}
              sx={{
                borderRadius: "8px",
                px: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
              endIcon={<SendIcon />}
            >
              Gửi
            </Button>
          </Box>
        </Paper>

        {/* Comment List */}
        {comments.length > 0 ? (
          comments.map((cmt, index) => (
            <Paper
              key={index}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: "12px",
                bgcolor: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "secondary.main" }}>U</Avatar>
                <Box>
                  <Typography variant="body1" sx={{ color: "#333" }}>
                    {cmt.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {cmt.time}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default BlogDetail;
