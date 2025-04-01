import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Tooltip,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import blogadService from "../../services/adminService/blogadService";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogadService.getBlogs();
        setBlogs(data || []);
        setFilteredBlogs(data || []); // Hiển thị tất cả blog ban đầu
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Xử lý tìm kiếm khi nhấn nút Search
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredBlogs(blogs); // Nếu không nhập gì, hiển thị tất cả
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredBlogs(filtered);
    }
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Xử lý khi nhấp vào một blog
  const handleRowClick = (blog) => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  // Đóng dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedBlog(null);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          🛍️ Blog List
        </Typography>
      </Box>

      <TextField
        label="Tìm kiếm theo tiêu đề"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress} // Hỗ trợ nhấn Enter để tìm kiếm
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <TableRow
                  key={blog._id}
                  hover
                  onClick={() => handleRowClick(blog)}
                  sx={{ cursor: "pointer" }}
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
                          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                        }}
                      />
                    ) : (
                      "Không có hình ảnh"
                    )}
                  </TableCell>
                  <TableCell>
                    {blog.detail && blog.detail.length > 0
                      ? `${blog.detail.length} chi tiết...`
                      : "Không có chi tiết"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có bài viết nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog hiển thị chi tiết */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: "bold F", color: "#1976d2" }}>
          Chi tiết bài viết: {selectedBlog?.title}
        </DialogTitle>
        <DialogContent>
          {selectedBlog?.detail && selectedBlog.detail.length > 0 ? (
            selectedBlog.detail.map((detail, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Phần chi tiết {index + 1}
                </Typography>
                {detail.image && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={detail.image}
                      alt={`Detail ${index}`}
                      style={{ width: 100, height: 60, borderRadius: 5 }}
                    />
                  </Box>
                )}
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {detail.text || "Không có nội dung"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>Không có chi tiết nào để hiển thị.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#757575" }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BlogList;
