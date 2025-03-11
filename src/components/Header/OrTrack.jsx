import { useState } from "react";
import orderService from "../../services/orderService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const OrTrack = () => {
  const [customerId, setCustomerId] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!customerId.trim()) {
      alert("Vui lòng nhập Customer ID!");
      return;
    }
    try {
      const data = await orderService.getOrdersByCustomerId(customerId);
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Theo dõi đơn hàng
      </Typography>
      <TextField
        label="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <Button onClick={fetchOrders} variant="contained" sx={{ marginLeft: 2 }}>
        Tra cứu
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày mua</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.order_status}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Không có đơn hàng nào!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrTrack;
