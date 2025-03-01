import React, { useEffect, useState } from "react";
import blogService from "../../services/adminService/blogadService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const BlogList = ({ role }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, type: "", text: "" });

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [blogs, searchQuery]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      showMessage("error", "Lỗi khi tải danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          formatDate(blog.createdAt).includes(query),
      );
      setFilteredBlogs(filtered);
    }
  };

  const handleOpenDialog = (blog = null) => {
    setSelectedBlog(blog);
    setFormData(
      blog
        ? { title: blog.title, content: blog.content, author: blog.author }
        : { title: "", content: "", author: "" },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (selectedBlog) {
        await blogService.updateBlog(selectedBlog.id, formData);
        showMessage("success", "Cập nhật blog thành công!");
      } else {
        await blogService.createBlog(formData);
        showMessage("success", "Thêm blog mới thành công!");
      }
      fetchBlogs();
      handleCloseDialog();
    } catch (error) {
      showMessage("error", "Lỗi khi lưu blog!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
      setLoading(true);
      try {
        await blogService.deleteBlog(id);
        showMessage("success", "Xóa blog thành công!");
        fetchBlogs();
      } catch (error) {
        showMessage("error", "Lỗi khi xóa blog!");
      } finally {
        setLoading(false);
      }
    }
  };

  const showMessage = (type, text) => {
    setMessage({ open: true, type, text });
  };

  return (
    <>
      {/* Thanh tìm kiếm */}
      <TextField
        label="Tìm kiếm theo tiêu đề hoặc ngày (dd/mm/yyyy)"
        variant="outlined"
        fullWidth
        margin="dense"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {role === "manager" && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          style={{ margin: "10px 0" }}
        >
          Thêm Blog Mới
        </Button>
      )}

      {loading && (
        <CircularProgress style={{ display: "block", margin: "20px auto" }} />
      )}

      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Tiêu đề</b>
                </TableCell>
                <TableCell>
                  <b>Nội dung</b>
                </TableCell>
                <TableCell>
                  <b>Tác giả</b>
                </TableCell>
                <TableCell>
                  <b>Ngày tạo</b>
                </TableCell>
                <TableCell>
                  <b>Hành động</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.content}</TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>{formatDate(blog.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleOpenDialog(blog)}
                      style={{ marginRight: "5px" }}
                    >
                      Sửa
                    </Button>
                    {role === "manager" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Xóa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog thêm/sửa blog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedBlog ? "Cập nhật Blog" : "Thêm Blog Mới"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            name="title"
            fullWidth
            margin="dense"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Nội dung"
            name="content"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={formData.content}
            onChange={handleChange}
          />
          <TextField
            label="Tác giả"
            name="author"
            fullWidth
            margin="dense"
            value={formData.author}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {selectedBlog ? "Lưu thay đổi" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo trạng thái */}
      <Snackbar
        open={message.open}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert severity={message.type} sx={{ width: "100%" }}>
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BlogList;
