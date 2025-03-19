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

    const newComments = [newComment, ...comments]; // Đưa comment mới lên đầu
    setComments(newComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(newComments));
    setComment("");
  };

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

  if (!blog)
    return (
      <Typography variant="h6" align="center" color="error" mt={5}>
        Không tìm thấy bài viết!
      </Typography>
    );

  return (
    <Container maxWidth="md">
      {/* Breadcrumbs */}
      <Box mt={4} mb={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/blog")}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Blog
          </Link>
          <Typography color="text.primary">{blog.title}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Nội dung Blog */}
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9f9f9" }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom align="center">
          {blog.title}
        </Typography>

        {blog.image && (
          <Box
            component="img"
            src={blog.image}
            alt={blog.title}
            width="100%"
            borderRadius={3}
            sx={{
              boxShadow: 3,
              mt: 2,
              mb: 3,
              transition: "0.3s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          />
        )}

        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, fontSize: "1.1rem", color: "text.secondary" }}
        >
          {blog.content}
        </Typography>
      </Paper>

      {/* Khu vực bình luận */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Bình luận
        </Typography>

        {/* Form nhập bình luận */}
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderRadius: 3,
            backgroundColor: "#f0f0f0",
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
            sx={{ ml: 2, minWidth: "120px" }}
            endIcon={<SendIcon />}
          >
            Gửi
          </Button>
        </Paper>

        {/* Danh sách bình luận */}
        <List
          sx={{ mt: 2, bgcolor: "background.paper", borderRadius: 2, p: 2 }}
        >
          {comments.length > 0 ? (
            comments.map((cmt, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9",
                  mb: 2,
                  "&:hover": { backgroundColor: "#f0f0f0" },
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
              sx={{ mt: 2, textAlign: "center" }}
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
