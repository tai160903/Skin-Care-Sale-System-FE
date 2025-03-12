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
import Header from "../components/Header/Header"; // Thêm dòng import này

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
        console.log("Orders:", res.data.data?.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer_id]);

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
      <Header /> {/* Thêm Header vào đây */}
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
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Total Price
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Payment
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Shipping Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Shipping Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                hover
                sx={{
                  transition: "0.3s",
                  "&:hover": { bgcolor: "#e3f2fd" },
                }}
              >
                <TableCell>{order?.order_id?._id || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={order?.order_id?.order_status || "Unknown"}
                    color={
                      order?.order_id?.order_status === "Completed"
                        ? "success"
                        : order?.order_id?.order_status === "Pending"
                          ? "warning"
                          : "error"
                    }
                    icon={
                      order?.order_id?.order_status === "Completed" ? (
                        <CheckCircle />
                      ) : order?.order_id?.order_status === "Pending" ? (
                        <PendingActions />
                      ) : (
                        <Cancel />
                      )
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={`${order?.order_id?.finalPrice?.toLocaleString() || "N/A"} VND`}
                  >
                    <Typography fontWeight="bold" color="#1976D2">
                      {order?.order_id?.finalPrice
                        ? order.order_id.finalPrice.toLocaleString()
                        : "N/A"}{" "}
                      VND
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order?.order_id?.payment_method || "Unknown"}
                    color="primary"
                    icon={
                      order?.order_id?.payment_method === "Credit Card" ? (
                        <CreditCard />
                      ) : (
                        <LocalAtm />
                      )
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={order?.shipping_address || "Unknown"}>
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {order?.shipping_address || "N/A"}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order?.shipping_status || "Unknown"}
                    color={
                      order?.shipping_status === "Delivered"
                        ? "success"
                        : order?.shipping_status === "Processing"
                          ? "warning"
                          : "error"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderHistory;
