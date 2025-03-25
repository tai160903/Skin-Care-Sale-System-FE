import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
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
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Pagination,
  Tooltip,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

// Hàm lấy màu sắc cho trạng thái đơn hàng
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [status, page]);

  const fetchOrders = async () => {
    try {
      let data;
      if (status === "All") {
        data = await orderService.getAllOrders({ page, limit });
      } else {
        data = await orderService.getOrdersByStatus(status);
      }
      setTotalPages(data.data.totalPages || 1);
      setOrders(data.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: 3,
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          📦 Quản lý đơn hàng
        </Typography>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            minWidth: 150,
            backgroundColor: "#fff",
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1565c0",
            },
          }}
          displayEmpty
        >
          <MenuItem value="All">Tất cả đơn ssjhàng</MenuItem>
          <MenuItem value="Pending">Đang xử lý</MenuItem>
          <MenuItem value="Completed">Hoàn thành</MenuItem>
          <MenuItem value="Cancelled">Đã hủy</MenuItem>
        </Select>
      </Box>

      <TableContainer sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tổng tiền
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Sản phẩm
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Phương thức thanh toán
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ngày tạo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Không có đơn hàng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                    {order.totalPay
                      ? `$${order.totalPay.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Accordion
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        "&:before": { display: "none" },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ backgroundColor: "#fafafa" }}
                      >
                        <Typography sx={{ fontWeight: "medium" }}>
                          {order.items?.length || 0} sản phẩm
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2 }}>
                        {order.items?.map((item) => (
                          <Box
                            key={item._id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            <Avatar
                              src={item.product_id?.image}
                              alt={item.product_id?.name}
                              sx={{
                                width: 60,
                                height: 60,
                                mr: 2,
                                borderRadius: 1,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", color: "#333" }}
                              >
                                {item.product_id?.name ||
                                  "Sản phẩm không xác định"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Số lượng: {item.quantity || 0}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Giá: $
                                {item.priceAtTime?.toLocaleString() || "N/A"}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Danh mục:{" "}
                                {item.product_id?.category?.name || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={order.order_status || "Không xác định"}>
                      <Chip
                        label={order.order_status || "Unknown"}
                        color={getStatusColor(order.order_status)}
                        sx={{ fontWeight: "bold", minWidth: 100 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium", color: "#1976d2" }}>
                    {order.payment_method
                      ? order.payment_method.toUpperCase()
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#555" }}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
          sx={{ "& .MuiPaginationItem-root": { fontSize: "1rem" } }}
        />
      </Box>
    </Paper>
  );
};

export default OrdersTable;
