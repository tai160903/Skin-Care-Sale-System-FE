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
} from "@mui/material";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      let data;
      if (status === "All") {
        data = await orderService.getAllOrders();
      } else {
        data = await orderService.getOrdersByStatus(status);
      }
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Management
      </Typography>
      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
      </Select>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Total Pay</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.totalPay}</TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      Product ID: {item.product_id}, Quantity: {item.quantity},
                      Price: {item.priceAtTime}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{order.order_status}</TableCell>
                <TableCell>{order.payment_method}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrdersTable;
