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
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  LocalShipping,
  CreditCard,
  MonetizationOn,
  AccountBalanceWallet,
} from "@mui/icons-material";
import Header from "../../components/Header/Header";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customer_id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customer_id=${customer_id}`,
        );

        console.log("API Response:", res.data);

        if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
          setOrders(res.data.data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching order tracking data:", error);
        setOrders([]);
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

  const getPaymentChip = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return { label: "Stripe", color: "warning", icon: <CreditCard /> };
      case "cash":
        return { label: "Cash", color: "success", icon: <MonetizationOn /> };
      case "paypal":
        return {
          label: "PayPal",
          color: "primary",
          icon: <AccountBalanceWallet />,
        };
      default:
        return { label: method || "N/A", color: "default", icon: undefined };
    }
  };

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
          Order Tracking
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Order Tracking
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Phone Number
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Shipping Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Address
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Payment Method
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const paymentInfo = getPaymentChip(
                  order.order_id?.payment_method,
                );
                return (
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
                            : order.shipping_status === "Pending"
                              ? "warning"
                              : "default"
                        }
                        icon={<LocalShipping />}
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>{order.shipping_address || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={paymentInfo.label}
                        color={paymentInfo.color}
                        icon={paymentInfo.icon}
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    No orders found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrderTracking;
