import { useState, useEffect } from "react";
import {
  Container,
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
} from "@mui/material";
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
        setBlogs(blogs.map((blog) => (blog._id === currentBlogId ? { ...blog, ...newBlog } : blog)));
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
    <Container>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2, color: "#1976d2" }}>
        Quản lý Bài viết
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#0288d1", ":hover": { backgroundColor: "#0277bd" }, marginBottom: 2 }}
        onClick={() => {
          setOpen(true);
          resetForm();
        }}
      >
        Thêm Bài viết
      </Button>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Tiêu đề</strong></TableCell>
              <TableCell><strong>Nội dung</strong></TableCell>
              <TableCell><strong>Hình ảnh</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <TableRow key={blog._id} hover>
                  <TableCell>{blog._id}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.content.substring(0, 50)}...</TableCell>
                  <TableCell>
                    <img src={blog.image} alt={blog.title} style={{ width: 80, height: 50, borderRadius: 5 }} />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" sx={{ marginRight: 1 }} onClick={() => handleEditBlog(blog)}>
                      Sửa
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteBlog(blog._id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
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
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>{editMode ? "Chỉnh sửa Bài viết" : "Thêm Bài viết"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Tiêu đề" fullWidth value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} />
          <TextField margin="dense" label="Nội dung" fullWidth multiline rows={4} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} />
          <TextField margin="dense" label="URL Hình ảnh" fullWidth value={newBlog.image} onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#757575" }}>Hủy</Button>
          <Button onClick={handleSaveBlog} sx={{ backgroundColor: "#0288d1", color: "#fff", ":hover": { backgroundColor: "#0277bd" }}}>
            {editMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogList;
