import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";
import {
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import cartService from "../services/cartService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      item.product_id.price *
        (1 - item.product_id.discountPercentage / 100) *
        item.quantity,
    0,
  );
  const customerId = useSelector((state) => state.user.customer?._id);

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveItem = async (productId) => {
    if (!customerId) {
      toast.error("Bạn cần đăng nhập để xóa sản phẩm!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }
    const userConfirmed = window.confirm("Bạn có muốn xóa sản phẩm này?");
    if (userConfirmed) {
      try {
        const response = await cartService.removeItem(customerId, productId);
        if (response.status === 200) {
          dispatch(removeFromCart(productId));
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error("Không thể xóa sản phẩm. Vui lòng thử lại!", error);
      }
    }
  };
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Cuộn mượt mà
  });

  const handleCheckout = () => {
    if (!customerId) {
      toast.error("Bạn cần đăng nhập để thanh toán!");
      navigate("/signin");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn chưa có sản phẩm!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", py: 6, px: { xs: 2, sm: 4 } }}>
      {/* Tiêu đề */}
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
      >
        Quay về Trang Chủ
      </button>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 6,
          color: "grey.800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span role="img" aria-label="cart">
          🛒
        </span>
        Giỏ Hàng Của Bạn
      </Typography>

      {/* Bảng giỏ hàng */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              {["Sản phẩm", "Giá", "Số lượng", "Tổng", "Xóa"].map((header) => (
                <TableCell
                  key={header}
                  align={header === "Sản phẩm" ? "left" : "center"}
                  sx={{ fontWeight: "bold", color: "grey.800", py: 2 }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <TableRow
                  key={item.product_id._id}
                  sx={{
                    "&:hover": { bgcolor: "grey.50" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        component="img"
                        src={item.product_id.image}
                        alt={item.product_id.name}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          objectFit: "cover",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "medium", color: "grey.900" }}
                      >
                        {item.product_id.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {formatCurrency(
                      item.product_id.price *
                        (1 - item.product_id.discountPercentage / 100),
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          handleDecreaseQuantity(item.product_id._id)
                        }
                        color="error"
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          handleIncreaseQuantity(item.product_id._id)
                        }
                        color="primary"
                        size="small"
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {formatCurrency(
                      item.product_id.price *
                        (1 - item.product_id.discountPercentage / 100) *
                        item.quantity,
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleRemoveItem(item.product_id._id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="h6" sx={{ color: "grey.500", py: 4 }}>
                    🛍️ Giỏ hàng của bạn đang trống!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tổng tiền và nút thanh toán */}
      <Card
        sx={{
          mt: 6,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          bgcolor: "grey.50",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ color: "grey.700", mb: 2 }}>
            Tạm tính:{" "}
            <Typography
              component="span"
              sx={{ fontWeight: "bold", color: "grey.900" }}
            >
              {formatCurrency(cartItems.length > 0 ? totalPrice : 0)}
            </Typography>
          </Typography>
          <Divider sx={{ my: 2, bgcolor: "grey.300" }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "success.main", mb: 3 }}
          >
            Thành tiền: {formatCurrency(cartItems.length > 0 ? totalPrice : 0)}
          </Typography>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleCheckout}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "success.dark",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            🏦 Thanh Toán Ngay
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cart;
