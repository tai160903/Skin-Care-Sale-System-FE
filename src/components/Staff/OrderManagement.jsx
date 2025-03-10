import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { toast } from "react-toastify";
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
  Chip,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending confirmation":
      return "warning";
    case "complete confirmation":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data;
      if (statusFilter === "All") {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getOrdersByStatus(statusFilter);
      }
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f8f9fa" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          📦 Order Management
        </Typography>
        <Button
          onClick={fetchOrders}
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
        >
          Refresh Orders
        </Button>
      </Box>

      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        sx={{ marginBottom: 2, backgroundColor: "white", borderRadius: 2 }}
      >
        <MenuItem value="All">All Orders</MenuItem>
        <MenuItem value="Pending Confirmation">Pending Confirmation</MenuItem>
        <MenuItem value="Complete Confirmation">Complete Confirmation</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} sx={{ backgroundColor: "white" }}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>
                    <Select
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{ backgroundColor: "white", borderRadius: 2 }}
                    >
                      <MenuItem value="Pending Confirmation">Pending Confirmation</MenuItem>
                      <MenuItem value="Complete Confirmation">Complete Confirmation</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                    <Chip
                      label={order.order_status}
                      color={getStatusColor(order.order_status)}
                      sx={{ ml: 2, fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default OrderManagement;