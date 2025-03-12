import { useEffect, useState } from "react";
import axios from "axios";
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
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  Cancel,
  PendingActions,
  CreditCard,
  LocalAtm,
} from "@mui/icons-material";
import Header from "../components/Header/Header";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { customer_id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/orders?customer_id=${customer_id}`,
        );
        setOrders(res.data.data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer_id]);

  // ✅ Tính tổng Total Pay của tất cả đơn hàng
  const totalPayAllProducts = orders.reduce(
    (sum, order) => sum + (order.totalPay || 0),
    0,
  );

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
    <>
      <Header />
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
          Order History
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Order ID
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Total Pay
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Discount
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Order Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Payment Method
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Order Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                hover
                sx={{ "&:hover": { bgcolor: "#e3f2fd" } }}
              >
                <TableCell>{order?._id || "N/A"}</TableCell>
                <TableCell>
                  <Tooltip
                    title={`${order?.totalPay?.toLocaleString() || "N/A"} VND`}
                  >
                    <Typography fontWeight="bold" color="#1976D2">
                      {order?.totalPay
                        ? order.totalPay.toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`${order?.discount?.toLocaleString() || "0"} %`}
                  >
                    <Typography fontWeight="bold" color="#d32f2f">
                      {order?.discount
                        ? `-${order.discount.toLocaleString()}`
                        : "0"}{" "}
                      %
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order?.order_status || "Unknown"}
                    color={
                      order?.order_status === "Completed"
                        ? "success"
                        : order?.order_status === "Pending"
                          ? "warning"
                          : "error"
                    }
                    icon={
                      order?.order_status === "Completed" ? (
                        <CheckCircle />
                      ) : order?.order_status === "Pending" ? (
                        <PendingActions />
                      ) : (
                        <Cancel />
                      )
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order?.payment_method || "Unknown"}
                    color="primary"
                    icon={
                      order?.payment_method === "Credit Card" ? (
                        <CreditCard />
                      ) : (
                        <LocalAtm />
                      )
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {/* 🔥 Hàng Tổng Cộng - Total Pay Of All Product */}
            <TableRow sx={{ bgcolor: "#e8f5e9" }}>
              <TableCell colSpan={5} align="right">
                <Typography fontWeight="bold" fontSize="1.1rem">
                  Total Pay Of All Product:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold" fontSize="1.1rem" color="#16a34a">
                  {totalPayAllProducts.toLocaleString()} VND
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderHistory;
