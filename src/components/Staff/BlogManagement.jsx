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
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search, Clear } from "@mui/icons-material";
import blogadService from "../../services/adminService/blogadService";
import UploadImage from "../UploadImage";
import { toast } from "react-toastify";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredBlogs(data || []);
        // toast.success("Tải danh sách bài viết thành công!");
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
        toast.error("Không thể tải danh sách bài viết!");
      }
    };
    fetchBlogs();
  }, []);

  // Hàm validate dữ liệu
  const validateBlogData = () => {
    const trimmedTitle = newBlog.title.trim();
    const trimmedContent = newBlog.content.trim();

    // Validate tiêu đề
    if (!trimmedTitle) {
      toast.error("Tiêu đề không được để trống!");
      return false;
    }
    if (trimmedTitle.length > 100) {
      toast.error("Tiêu đề không được vượt quá 100 ký tự!");
      return false;
    }
    const spamPattern = /^(.)\1*$|^[^a-zA-Z0-9À-ỹ\s]+$/;
    if (spamPattern.test(trimmedTitle)) {
      toast.error("Tiêu đề không được chứa ký tự spam hoặc lặp lại vô nghĩa!");
      return false;
    }
    if (
      !editMode &&
      blogs.some(
        (blog) => blog.title.toLowerCase() === trimmedTitle.toLowerCase(),
      )
    ) {
      toast.error("Tiêu đề này đã tồn tại! Vui lòng chọn tiêu đề khác.");
      return false;
    }

    // Validate nội dung
    if (!trimmedContent) {
      toast.error("Nội dung không được để trống!");
      return false;
    }
    if (spamPattern.test(trimmedContent)) {
      toast.error("Nội dung không được chứa ký tự spam hoặc lặp lại vô nghĩa!");
      return false;
    }

    // Validate hình ảnh chính
    if (!newBlog.image) {
      toast.error("Hình ảnh chính không được để trống!");
      return false;
    }

    // Validate chi tiết
    for (let i = 0; i < newBlog.detail.length; i++) {
      const detail = newBlog.detail[i];
      const trimmedDetailText = detail.text.trim();
      if (!detail.image || !trimmedDetailText) {
        toast.error(`Phần chi tiết ${i + 1} phải có cả hình ảnh và nội dung!`);
        return false;
      }
      if (trimmedDetailText.length > 500) {
        toast.error(
          `Nội dung chi tiết ${i + 1} không được vượt quá 500 ký tự!`,
        );
        return false;
      }
      if (spamPattern.test(trimmedDetailText)) {
        toast.error(
          `Nội dung chi tiết ${i + 1} không được chứa ký tự spam hoặc lặp lại vô nghĩa!`,
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
      setBlogs([...blogs, createdBlog.data]);
      setFilteredBlogs([...blogs, createdBlog.data]);
      setOpen(false);
      resetForm();
      toast.success(createdBlog.message);
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
      const updatedBlogs = blogs.map((blog) =>
        blog._id === currentBlogId ? { ...blog, ...newBlog } : blog,
      );
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs);
      setOpen(false);
      resetForm();
      toast.success(updatedBlog.message);
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
        const updatedBlogs = blogs.filter((blog) => blog._id !== id);
        setBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
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

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBlogs(filtered);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredBlogs(blogs);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span role="img" aria-label="blog" style={{ marginRight: 8 }}>
            📝
          </span>
          Quản lý Bài viết
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#0288d1",
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 16px",
            ":hover": {
              backgroundColor: "#0277bd",
              transform: "scale(1.03)",
            },
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => {
            setOpen(true);
            resetForm();
          }}
        >
          Thêm Bài viết
        </Button>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Tìm kiếm theo tiêu đề"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#0288d1" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton
                    onClick={handleClearSearch}
                    size="small"
                    sx={{
                      color: "#757575",
                      "&:hover": { color: "#d32f2f" },
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    color: "#0288d1",
                    "&:hover": { color: "#1976d2" },
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table Section */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tiêu đề
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Nội dung
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Hình ảnh
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Chi tiết
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <Fade in key={blog._id} timeout={500}>
                  <TableRow
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#e3f2fd" },
                      transition: "background-color 0.2s",
                    }}
                  >
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
                            objectFit: "cover",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
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
                                style={{ width: 50, marginBottom: 4 }}
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
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Chỉnh sửa" TransitionComponent={Zoom}>
                        <IconButton
                          sx={{
                            color: "#0288d1",
                            backgroundColor: "#e3f2fd",
                            mr: 1,
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                          }}
                          onClick={() => handleEditBlog(blog)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa" TransitionComponent={Zoom}>
                        <IconButton
                          sx={{
                            color: "#d32f2f",
                            backgroundColor: "#ffebee",
                            "&:hover": {
                              backgroundColor: "#ffcdd2",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                          }}
                          onClick={() => handleDeleteBlog(blog._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: 4, color: "#757575" }}
                >
                  Không có bài viết nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Edit */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
          }}
        >
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Hình ảnh chính
          </Typography>
          <UploadImage
            onUploadSuccess={(url) => setNewBlog({ ...newBlog, image: url })}
          />
          {newBlog.image && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <img
                src={newBlog.image}
                alt="Preview"
                style={{ width: 100, height: 60, borderRadius: 5 }}
              />
            </Box>
          )}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Chi tiết
          </Typography>
          {newBlog.detail.map((detail, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Phần chi tiết {index + 1}
              </Typography>
              <UploadImage
                onUploadSuccess={(url) =>
                  handleDetailChange(index, "image", url)
                }
              />
              {detail.image && (
                <Box sx={{ mt: 1, mb: 1 }}>
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
          <Button
            variant="outlined"
            onClick={addDetailSection}
            sx={{ mt: 1, borderRadius: 2, textTransform: "none" }}
          >
            Thêm phần chi tiết
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#757575", textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveBlog}
            sx={{
              backgroundColor: "#0288d1",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
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

export default BlogManagement;
