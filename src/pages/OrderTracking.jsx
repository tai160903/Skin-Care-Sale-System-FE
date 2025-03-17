import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { LocalShipping, CreditCard } from "@mui/icons-material";

const OrderTracking = () => {
  const { customerId } = useOutletContext(); // Nhận customerId từ ProfileLayout
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("customerId:", customerId); // Debug xem có lấy đúng customerId không

  useEffect(() => {
    if (!customerId) {
      console.error("customerId is undefined");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customer_id=${customerId}`,
        );
        console.log("API Response:", res.data);
        setOrders(res.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={50} />
      </Box>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        maxWidth: "95%",
        mx: "auto",
        my: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          p: 2,
          fontWeight: "bold",
          color: "#fff",
          bgcolor: "#16a34a",
          textAlign: "center",
        }}
      >
        Lich su
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Order ID
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Phone
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Address
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Payment
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow
                key={order._id}
                hover
                sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
              >
                <TableCell>{order._id || "N/A"}</TableCell>
                <TableCell>{order.shipping_phone || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={order.shipping_status || "Unknown"}
                    color={
                      order.shipping_status === "Shipped"
                        ? "primary"
                        : "default"
                    }
                    icon={<LocalShipping />}
                  />
                </TableCell>
                <TableCell>{order.shipping_address || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={order.order_id?.payment_method || "N/A"}
                    color="success"
                    icon={<CreditCard />}
                  />
                </TableCell>
                <TableCell>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="textSecondary">No orders found.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTracking;
