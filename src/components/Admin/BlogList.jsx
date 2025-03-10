import { useState, useEffect } from "react";
import { Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
  Zoom,
  Fade,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import blogadService from "../../services/adminService/blogadService";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: "" });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogadService.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleSaveBlog = async () => {
    if (!newBlog.title || !newBlog.content || !newBlog.image) {
      alert("Vui lòng nhập đầy đủ thông tin bài viết!");
      return;
    }
    try {
      if (editMode) {
        await blogadService.updateBlog(currentBlogId, newBlog);
        setBlogs(
          blogs.map((blog) =>
            blog._id === currentBlogId ? { ...blog, ...newBlog } : blog
          )
        );
      } else {
        const createdBlog = await blogadService.createBlog(newBlog);
        setBlogs([...blogs, createdBlog]);
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await blogadService.deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      }
    }
  };

  const handleEditBlog = (blog) => {
    setNewBlog(blog);
    setCurrentBlogId(blog._id);
    setEditMode(true);
    setOpen(true);
  };

  const resetForm = () => {
    setNewBlog({ title: "", content: "", image: "" });
    setEditMode(false);
    setCurrentBlogId(null);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      🛍️ Product Management
    </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          backgroundColor: "#0288d1",
          ":hover": { backgroundColor: "#0277bd", transform: "scale(1.05)" },
          transition: "0.3s ease-in-out",
          mb: 2,
        }}
        onClick={() => {
          setOpen(true);
          resetForm();
        }}
      >
        Thêm Bài viết
      </Button>

      <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}><strong>ID</strong></TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}><strong>Tiêu đề</strong></TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}><strong>Nội dung</strong></TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}><strong>Hình ảnh</strong></TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Fade in key={blog._id} timeout={500}>
                  <TableRow hover>
                    <TableCell>{blog._id}</TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>
                      <Tooltip title={blog.content} arrow TransitionComponent={Zoom}>
                        <span>{blog.content.substring(0, 50)}...</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: 80,
                          height: 50,
                          borderRadius: 5,
                          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton color="primary" onClick={() => handleEditBlog(blog)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa" TransitionComponent={Zoom}>
                        <IconButton color="error" onClick={() => handleDeleteBlog(blog._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có bài viết nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
          {editMode ? (
            <>
              <Edit sx={{ verticalAlign: "middle", mr: 1 }} />
              Chỉnh sửa Bài viết
            </>
          ) : (
            <>
              <Add sx={{ verticalAlign: "middle", mr: 1 }} />
              Thêm Bài viết
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Tiêu đề" fullWidth value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} />
          <TextField margin="dense" label="Nội dung" fullWidth multiline rows={4} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} />
          <TextField margin="dense" label="URL Hình ảnh" fullWidth value={newBlog.image} onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#757575" }}>Hủy</Button>
          <Button onClick={handleSaveBlog} sx={{ backgroundColor: "#0288d1", color: "#fff", ":hover": { backgroundColor: "#0277bd" } }}>
            {editMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BlogList;
