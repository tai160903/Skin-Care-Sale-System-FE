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
  Pagination,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  Cancel,
  PendingActions,
  CreditCard,
  LocalAtm,
} from "@mui/icons-material";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { customerId } = useParams();
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const res = await orderService.getOrderbyId({ page, limit });
        const res = await axios.get(
          `http://localhost:8080/api/orders?page=${page}&limit=${limit}`,
        );
        console.log(res.data);
        setTotalPages(res.data.totalPages);
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, page, limit]);

  const totalPayAllProducts = orders.reduce(
    (sum, order) => sum + (order.totalPay || 0),
    0,
  );

  const handlePageChange = (event, value) => {
    setPage(value);
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

  return (
    <Box sx={{ maxWidth: "95%", mx: "auto", my: 3 }}>
      <Typography
        variant="h5"
        sx={{
          p: 2,
          fontWeight: "bold",
          color: "#fff",
          bgcolor: "#16a34a",
          textAlign: "center",
          borderRadius: "8px 8px 0 0",
        }}
      >
        Order History
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 4, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              {[
                "Order ID",
                "Total Pay",
                "Discount",
                "Order Status",
                "Payment Method",
                "Order Date",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {header}
                </TableCell>
              ))}
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
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default OrderHistory;
