import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const limit = 10;
  const fetchOrders = async () => {
    try {
      let data;
      if (status === "All") {
        data = await orderService.getAllOrders({ page, limit });
        console.log(data);
      } else {
        data = await orderService.getOrdersByStatus(status);
      }
      setTotalPages(data.data.totalPages);
      setOrders(data.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        📦 Order Management
      </Typography>
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: 2 }}
      >
        <MenuItem value="All">All Orders</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total Pay
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Items
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Order Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Payment Method
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Created At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={{ backgroundColor: "white" }}>
                <TableCell sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                  ${order.totalPay.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Accordion sx={{ backgroundColor: "#f1f1f1" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        View Items
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {order.items.map((item) => (
                        <Paper
                          key={item._id}
                          sx={{
                            padding: 1.5,
                            marginBottom: 1,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            boxShadow: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {item.product_id?.name || "Unknown Product"}
                          </Typography>
                          <Typography>
                            Số LượngLượng: {item.quantity}
                          </Typography>
                          <Typography>
                            Giá: ${item.priceAtTime.toLocaleString()}
                          </Typography>
                          <Typography>
                            Loại: {item.product_id?.category.name || "N/A"}
                          </Typography>
                          <Typography>
                            Rating: ⭐ {item.product_id?.rating || "N/A"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: 1,
                            }}
                          >
                            <img
                              src={item.product_id?.image}
                              alt={item.product_id?.name}
                              style={{ width: 80, borderRadius: 8 }}
                            />
                          </Box>
                        </Paper>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.order_status || "Unknown"}
                    color={getStatusColor(order.order_status)}
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  {order.payment_method
                    ? order.payment_method.toUpperCase()
                    : "N/A"}
                </TableCell>
                <TableCell sx={{ color: "#555" }}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Paper>
  );
};

export default OrdersTable;
