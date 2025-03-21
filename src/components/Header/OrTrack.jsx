import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Button,
  ButtonGroup,
  TextField,
} from "@mui/material";
import { LocalShipping, CreditCard, MonetizationOn } from "@mui/icons-material";
import Header from "../../components/Header/Header";

const OrderTr = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchDate, setSearchDate] = useState("");
  const { customer_id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/shippings?customer_id=${customer_id}`,
        );
        console.log("API Response:", res.data);

        if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
          setOrders(res.data.data.data);
          setFilteredOrders(res.data.data.data);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error fetching order tracking data:", error);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customer_id]);

  useEffect(() => {
    let filtered = orders;
    if (filter !== "All") {
      filtered = filtered.filter((order) => order.shipping_status === filter);
    }
    if (searchDate) {
      filtered = filtered.filter(
        (order) =>
          order.createdAt &&
          new Date(order.createdAt).toISOString().split("T")[0] === searchDate,
      );
    }
    setFilteredOrders(filtered);
  }, [filter, searchDate, orders]);

  const getPaymentChip = (method) => {
    switch (method?.toLowerCase()) {
      case "stripe":
        return { label: "Stripe", color: "warning", icon: <CreditCard /> };
      case "cash":
        return { label: "Cash", color: "success", icon: <MonetizationOn /> };
      default:
        return { label: method || "N/A", color: "default", icon: undefined };
    }
  };

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

  const handleViewDetails = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

  return (
    <>
      <Header />
      <Box display="flex" justifyContent="center" my={2} gap={2}>
        <ButtonGroup variant="contained">
          {["All", "Pending", "Cancelled", "Shipped"].map((status) => (
            <Button
              key={status}
              color={filter === status ? "primary" : "secondary"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </ButtonGroup>
        <TextField
          type="date"
          label="Search by Date"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </Box>
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
                đơn hàng
              </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
              Tổng thanh toán
            </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Số điện thoại
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Trạng thái giao hàng
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Địa chỉ
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Phương thức thanh toán
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Ngày
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
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
                    <TableCell>
                      {order.order_id.totalPay 
                        ? `${order.order_id.totalPay.toLocaleString("vi-VN")} VND` 
                        : "N/A"}
                    </TableCell>
                    <TableCell>{order.shipping_phone || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.shipping_status || "Unknown"}
                        color={
                          order.shipping_status === "Shipping"
                            ? "primary"
                            : order.shipping_status === "Pending"
                              ? "warning"
                              : order.shipping_status === "Cancelled"
                                ? "error"
                              : order.shipping_status === "Delivered"
                                ? "success"
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
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(order.order_id._id)}
                      >
                        Xem chi tiết
                      </Button>
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

export default OrderTr;
