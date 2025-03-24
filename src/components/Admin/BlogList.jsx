import { useState, useEffect } from "react";
import {
  Box,
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
import UploadImage from "../UploadImage";
import { toast } from "react-toastify"; // Import toast

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    image: "",
    detail: [{ image: "", text: "" }],
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogadService.getBlogs();
        setBlogs(data || []);
        toast.success("Tải danh sách bài viết thành công!");
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
        toast.error("Không thể tải danh sách bài viết!");
      }
    };
    fetchBlogs();
  }, []);

  // Hàm validate dữ liệu
  const validateBlogData = () => {
    if (!newBlog.title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return false;
    }
    if (newBlog.title.length > 100) {
      toast.error("Tiêu đề không được vượt quá 100 ký tự!");
      return false;
    }
    if (!newBlog.content.trim()) {
      toast.error("Nội dung không được để trống!");
      return false;
    }
    if (!newBlog.image) {
      toast.error("Hình ảnh chính không được để trống!");
      return false;
    }
    for (let i = 0; i < newBlog.detail.length; i++) {
      const detail = newBlog.detail[i];
      if (!detail.image || !detail.text.trim()) {
        toast.error(`Phần chi tiết ${i + 1} phải có cả hình ảnh và nội dung!`);
        return false;
      }
      if (detail.text.length > 500) {
        toast.error(
          `Nội dung chi tiết ${i + 1} không được vượt quá 500 ký tự!`,
        );
        return false;
      }
    }
    return true;
  };

  const handleCreateBlog = async () => {
    if (!validateBlogData()) return;
    try {
      const createdBlog = await blogadService.createBlog(newBlog);
      setBlogs([...blogs, createdBlog]);
      setOpen(false);
      resetForm();
      toast.success("Tạo bài viết thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast.error("Không thể tạo bài viết!");
    }
  };

  const handleUpdateBlog = async () => {
    if (!validateBlogData()) return;
    try {
      const updatedBlog = await blogadService.updateBlog(
        currentBlogId,
        newBlog,
      );
      setBlogs(
        blogs.map((blog) =>
          blog._id === currentBlogId ? { ...blog, ...newBlog } : blog,
        ),
      );
      setOpen(false);
      resetForm();
      toast.success("Cập nhật bài viết thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      toast.error("Không thể cập nhật bài viết!");
    }
  };

  const handleSaveBlog = () => {
    if (editMode) {
      handleUpdateBlog();
    } else {
      handleCreateBlog();
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await blogadService.deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success("Xóa bài viết thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        toast.error("Không thể xóa bài viết!");
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
    setNewBlog({
      title: "",
      content: "",
      image: "",
      detail: [{ image: "", text: "" }],
    });
    setEditMode(false);
    setCurrentBlogId(null);
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = newBlog.detail.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setNewBlog({ ...newBlog, detail: updatedDetails });
  };

  const addDetailSection = () => {
    if (newBlog.detail.length >= 5) {
      toast.warn("Không thể thêm quá 5 phần chi tiết!");
      return;
    }
    setNewBlog({
      ...newBlog,
      detail: [...newBlog.detail, { image: "", text: "" }],
    });
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Tiêu đề</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Nội dung</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Hình ảnh</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Chi tiết</strong>
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Fade in key={blog._id} timeout={500}>
                  <TableRow hover>
                    <TableCell>{blog._id}</TableCell>
                    <TableCell>{blog.title || "Không có tiêu đề"}</TableCell>
                    <TableCell>
                      <Tooltip
                        title={blog.content || ""}
                        arrow
                        TransitionComponent={Zoom}
                      >
                        <span>
                          {blog.content && typeof blog.content === "string"
                            ? blog.content.substring(0, 50) + "..."
                            : "Không có nội dung"}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title || "Hình ảnh"}
                          style={{
                            width: 80,
                            height: 50,
                            borderRadius: 5,
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                          }}
                        />
                      ) : (
                        "Không có hình ảnh"
                      )}
                    </TableCell>
                    <TableCell>
                      {blog.detail && blog.detail.length > 0 ? (
                        <Tooltip
                          title={blog.detail.map((d, i) => (
                            <div key={i}>
                              <img
                                src={d.image}
                                alt={`Detail ${i}`}
                                style={{ width: 50 }}
                              />
                              <p>{d.text}</p>
                            </div>
                          ))}
                          arrow
                          TransitionComponent={Zoom}
                        >
                          <span>{blog.detail.length} chi tiết...</span>
                        </Tooltip>
                      ) : (
                        "Không có chi tiết"
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditBlog(blog)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa" TransitionComponent={Zoom}>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteBlog(blog._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
          <TextField
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            inputProps={{ maxLength: 100 }}
            helperText={`${newBlog.title.length}/100 ký tự`}
          />
          <TextField
            margin="dense"
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            value={newBlog.content}
            onChange={(e) =>
              setNewBlog({ ...newBlog, content: e.target.value })
            }
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Hình ảnh chính
          </Typography>
          <UploadImage
            onUploadSuccess={(url) => setNewBlog({ ...newBlog, image: url })}
          />
          {newBlog.image && (
            <Box sx={{ mt: 1 }}>
              <img
                src={newBlog.image}
                alt="Preview"
                style={{ width: 100, height: 60, borderRadius: 5 }}
              />
            </Box>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chi tiết
          </Typography>
          {newBlog.detail.map((detail, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Phần chi tiết {index + 1}
              </Typography>
              <UploadImage
                onUploadSuccess={(url) =>
                  handleDetailChange(index, "image", url)
                }
              />
              {detail.image && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={detail.image}
                    alt={`Detail Preview ${index}`}
                    style={{ width: 80, height: 50, borderRadius: 5 }}
                  />
                </Box>
              )}
              <TextField
                margin="dense"
                label={`Nội dung chi tiết ${index + 1}`}
                fullWidth
                multiline
                rows={2}
                value={detail.text}
                onChange={(e) =>
                  handleDetailChange(index, "text", e.target.value)
                }
                inputProps={{ maxLength: 500 }}
                helperText={`${detail.text.length}/500 ký tự`}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={addDetailSection} sx={{ mt: 1 }}>
            Thêm phần chi tiết
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#757575" }}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveBlog}
            sx={{
              backgroundColor: "#0288d1",
              color: "#fff",
              ":hover": { backgroundColor: "#0277bd" },
            }}
          >
            {editMode ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BlogList;
